---
layout: post
translationKey: autenticazione-jwt-con-angular
title: Autenticazione JWT con Angular
excerpt: Impariamo come integrare il nostro sistema di autenticazione JWT in Angular
image: ../img/angular-jwt-auth/angular-jwt-rxjs.jpg
author: [Mattia Natali]
date: 2019-12-15T16:40:20.172Z
tags: 
  - Dev
  - Auth
  - How-to
draft: false
---

Al lavoro ho dovuto creare un nuovo portale web che dovesse comunicare con il nostro backend.
**La nostra scelta per il framework frontend è Angular e il nostro backend usa il JWT (JSON Web Token) come sistema di autenticazione.**

Quindi il mio obiettivo era integrare quel sistema di autenticazione in Angular per comunicare con il backend.
Dato che si trattava di un progetto Angular iniziato da zero, ho avuto la possibilità di pensare a come implementarlo.


## Obiettivi

I miei criteri di accettazione erano i seguenti:

- Per ottenere il token, il frontend dovrebbe chiamare l'endpoint `POST auth/login` con `email` e `password`. Il backend risponderà con `accessToken` e `refreshToken`.
- Il frontend dovrebbe persistere entrambi i token, così l'utente resterà autenticato anche se chiude il browser.
- Dovrebbe inviare l'accessToken per ogni chiamata API autenticata. Invia il token nell'header `X-AUTH-TOKEN`.
- Se il backend risponde `401 - Unauthorized`, significa che il token è scaduto. Quindi il frontend dovrebbe chiamare l'endpoint `POST auth/refresh` passando `refreshToken`. Se il `refreshToken` è valido, il backend risponde con nuovi `accessToken` e `refreshToken` nel body della risposta.
  - Dopo aver recuperato il nuovo `accessToken`, dovrebbe ritentare la chiamata fallita con il token aggiornato.
  - Se il backend risponde di nuovo con `401 - Unauthorized` durante il refresh, significa che il `refreshToken` non è più valido. Dobbiamo fare il logout dell'utente.
- Dovremmo gestire tutte queste cose in modo trasparente, lo sviluppatore non dovrebbe preoccuparsene troppo quando implementa qualche classe per comunicare con il backend.

Questo flusso dovrebbe essere abbastanza standard per un sistema di autenticazione JWT. Ora pensiamo a come strutturarlo!

## Prerequisiti

Mi aspetto da te un po' di conoscenza di questi argomenti:

- [Angular](https://angular.io/) e gli [interceptor di Angular](https://angular.io/guide/http#intercepting-requests-and-responses).
- [RxJS](https://rxjs-dev.firebaseapp.com/), che è integrato nell'[HTTP Client](https://angular.io/guide/http) di Angular.

## Architettura

Ho costruito questa integrazione JWT usando il [Test Driven Development (TDD)](https://en.wikipedia.org/wiki/Test-driven_development). Così sono finito con classi facilmente testabili che hanno una sola responsabilità. Questa è la bellezza del TDD: per semplificare i test **devi** scrivere buon codice!

Ho costruito le seguenti classi:

- `AuthClient`: effettua le chiamate API al backend. Nel nostro esempio implementeremo `auth/login` e `auth/refresh`.
- `AuthStore`: persiste i token e mantiene lo stato degli utenti. Possiamo sapere se gli utenti sono autenticati o meno.
- `AuthService`: gestisce la logica di business del nostro sistema di autenticazione, sfrutta sia `AuthClient` che `AuthStore`.
- `AuthInterceptor`: inietta il token in ogni chiamata API autenticata, e gestisce anche la logica di retry quando l'`accessToken` è scaduto.

Possiamo raggiungere i nostri criteri di accettazione con queste classi, ora implementiamole!

## Implementazione

### Interfacce

Costruire una single page application è complesso. Gestisce molti oggetti diversi ed è molto difficile tenerne traccia senza un sistema di tipi. TypeScript aggiunge i tipi a JavaScript e io lo sfrutto il più possibile.
Quindi creo sempre una cartella `/model` che tiene traccia di tutti gli oggetti che creo o ricevo dal backend.
In questo tutorial affronteremo queste interfacce:

```typescript
export interface ILogin {
    email: string;
    password: string;
}

export interface ILoginResponse {
    accessToken: string;
    refreshToken: string;
}

export interface IRefreshRequest {
  refreshToken: string;
}

```

### AuthClient

`AuthClient` è molto semplice da implementare. Effettua solo le chiamate API al nostro backend

```typescript
import { Injectable } from '@angular/core';
import { ILogin } from './model/Login';
import { ILoginResponse } from './model/LoginResponse';
import { IRefreshRequest } from './model/RefreshRequest';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { INTERCEPTOR_NO_AUTH_HEADER } from './constants';

@Injectable({
  providedIn: 'root'
})
export class AuthClient {

  constructor(
    private http: HttpClient,
  ) { }

  login(request: ILogin): Observable<ILoginResponse> {
    return this.http
      .post<ILoginResponse>(`${environment.portalBaseUrl}/auth/login`,
        request,
        {
          headers: { [INTERCEPTOR_NO_AUTH_HEADER]: 'true' }
        }
      );
  }

  refreshToken(request: IRefreshRequest) {
    return this.http
      .post<ILoginResponse>(`${environment.portalBaseUrl}/refresh`,
        request,
        {
          headers: { [INTERCEPTOR_NO_AUTH_HEADER]: 'true' }
        }
      );
  }
}

```

Puoi vedere che `AuthClient` è abbastanza semplice. L'unica cosa strana è l'header `INTERCEPTOR_NO_AUTH_HEADER` che ha un significato speciale. È il mio modo per comunicare con `AuthInterceptor`, sto dicendo: "Ehi! Questa è una chiamata API pubblica, non devi iniettare il token". Ne parlo più in dettaglio dopo.

### AuthStore

Memorizza e persiste le credenziali dell'utente. **La mia implementazione è fortemente ispirata al pattern Business Logic Component (BLoC) + RxJS**. È un pattern nuovo che sta emergendo nel [mondo Dart + Flutter](https://medium.com/flutter-community/why-use-rxdart-and-how-we-can-use-with-bloc-pattern-in-flutter-a64ca2c7c52d). Mi piace e ho portato il concetto in Angular.
Non voglio parlare troppo del pattern BLoC dato che ci sono [molti articoli a riguardo](https://www.google.com/search?q=BLoC+Pattern&oq=BLoC+Pattern).

In breve: sfrutto RxJS per creare uno store reattivo delle credenziali, chiunque sia interessato a dei dati di autenticazione dovrebbe sottoscriversi ad esso. Se qualcuno vuole cambiare i dati di autenticazione, può chiamare i metodi di autenticazione. Molto semplice.

#### Store generico

La prima cosa da fare è creare lo store generico che gestisce lo stato di tipo `T`. Questo è agnostico rispetto allo stato, quindi è una classe astratta. Questo store si chiama semplicemente `Store`.

```typescript
import { Observable, BehaviorSubject } from 'rxjs';

export class Store<T> {
    state$: Observable<T>;
    private stateSubject$: BehaviorSubject<T>;

    protected constructor(initialState: T) {
        this.stateSubject$ = new BehaviorSubject(initialState);
        this.state$ = this.stateSubject$.asObservable();
    }

    get state(): T {
        return this.stateSubject$.getValue();
    }

    setState(nextState: T): void {
        this.stateSubject$.next(nextState);
    }
}
```

Come puoi vedere:

- Accetta lo stato iniziale nel costruttore.
- Puoi cambiare lo stato chiamando il metodo `setState`.
- Puoi sottoscriverti ai cambiamenti di stato sottoscrivendoti all'observable `state$`.
- Puoi ottenere lo stato corrente una volta sola tramite il getter `state`.

**Il motore del mio store è il `stateSubject$` BehaviorSubject privato**. Se è la [prima volta che vedi un BehaviorSubject](https://www.learnrxjs.io/subjects/behaviorsubject.html), pensa a uno stream che ha anche un "sink", dove puoi aggiungere un nuovo elemento nello stream chiamando il metodo `next`. BehaviorSubject ha anche lo stato iniziale che dovresti fornire nel costruttore.

Un'altra cosa interessante è che puoi mantenere il "sink" privato ed esporre solo il suo observable. Sto esponendo solo la variabile `state$` che è l'`Observable` creato da `stateSubject$`.
In questo modo, nessuno può aggiungere un elemento in questo observable se non chiamando il metodo `setState`. In altre parole, puoi solo vedere i cambiamenti sottoscrivendoti all'observable `state$`, e puoi cambiare i dati dello store tramite il metodo `setState`. L'implementazione dello store è gestita da `stateSubject$` che non è esposto esternamente.

#### Implementazione concreta

Ora possiamo creare il nostro `AuthStore`, la prima implementazione concreta dello `Store`.

```typescript
import { IAuthState } from './auth-store.service';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Store } from '../shared/store';
import { Observable } from 'rxjs';
import { ILoginResponse } from './model/LoginResponse';

export interface IAuthState {
  accessToken: string;
  refreshToken: string;
}

const ACCESS_TOKEN_LOCAL_STORAGE_KEY = 'auth.accessToken';
const REFRESH_TOKEN_LOCAL_STORAGE_KEY = 'auth.refreshToken';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService extends Store<IAuthState> {
  constructor() {
    const initialState: IAuthState = {
      accessToken: localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY),
      refreshToken: localStorage.getItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY),
    };
    super(initialState);
  }

  setState(nextState: IAuthState): void {
    if (nextState.accessToken) {
      localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY, nextState.accessToken);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE_KEY);
    }
    if (nextState.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY, nextState.refreshToken);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_LOCAL_STORAGE_KEY);
    }
    super.setState(nextState);
  }

  get isLoggedIn(): boolean {
    return !!this.state.accessToken;
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.state$.pipe(map((state) => !!state.accessToken));
  }

  get accessToken(): string {
    return this.state.accessToken;
  }

  setAccessToken(accessToken: string) {
    this.setState({ ...this.state, accessToken });
  }

  get refreshToken(): string {
    return this.state.refreshToken;
  }

  login(loginResponse: ILoginResponse): void {
    this.setState({ ...this.state, ...loginResponse});
  }

  refresh(newTokens: ILoginResponse): void {
    this.setState({ ...this.state, ...newTokens });
  }

  logout(): void {
    this.setState({
      ...this.state,
      accessToken: null,
      refreshToken: null,
    });
  }
}
```

Ci sono molti metodi di supporto per semplificare l'uso della classe. Questi sono i punti chiave di questa classe:

- È una sottoclasse di `Store`, ha l'interfaccia `IAuthState` come stato. `IAuthState` è molto semplice, contiene solo `accessToken` e `refreshToken`.
- Ogni volta che qualcuno chiama `setState`, persiste i dati nel local storage. In questo modo, se l'utente chiude o ricarica la pagina, le credenziali non vanno perse. Se `setState` viene chiamato con credenziali falsy (ad esempio `null` o `false`), le rimuove dal local storage.
- Nel costruttore fornisce lo stato iniziale alla superclasse `State`. Prova a ottenere le credenziali dal local storage.
- Molti metodi getter: sia reattivi (terminano con `$`), sia standard (variabili classiche).
- Alcuni metodi di supporto per cambiare lo stato dello store (`setAccessToken`, `login`, `refresh`).

**Attenzione**: memorizzare `accessToken` e `refreshToken` nel local storage può esporre la tua applicazione a problemi di sicurezza. Qualsiasi JavaScript in esecuzione nella tua web app può leggerli.
Quindi **se la tua web app è vulnerabile al [cross-site scripting (XSS)](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)), allora qualcuno può rubarli**. I framework web, come Angular, sono consapevoli di questo problema: adottano standard di sicurezza elevati per evitare vulnerabilità XSS. Ti consiglio di dedicare un po' di tempo a leggere del [cross-site scripting (XSS)](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)).
Se hai paura di questo, semplicemente non salvare i token nel local storage, sarai al sicuro... Ma se il tuo utente chiude la pagina, dovrà fare di nuovo il login.

Ora il nostro AuthStore è pronto! Passiamo alla classe che collega tutto insieme: l'`AuthService`!

### AuthService

`AuthService` è la classe che contiene la logica di business per far funzionare l'autenticazione. Vediamo il codice:

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { AuthClient, IRefreshRequest } from './auth-client.service';
import { AuthStoreService } from './auth-store.service';
import { ILogin } from './model/Login';
import { ILoginResponse } from './model/LoginResponse';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private authClient: AuthClient,
    private authStore: AuthStoreService,
    private router: Router,
  ) { }

  login(request: ILogin): Observable<ILoginResponse> {
    return this.authClient.login(request)
      .pipe(
        tap(loginResponse => this.authStore.login(loginResponse)),
      );
  }

  refresh(refreshTokenRequest: IRefreshRequest): Observable<ILoginResponse> {
    return this.authClient.refreshToken(refreshTokenRequest)
      .pipe(
        tap(refreshResponse => this.authStore.refresh(refreshResponse))
      );
  }

  logout(): void {
    this.authStore.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
```

Questa classe usa sia `AuthClient`, per effettuare le chiamate API, sia `AuthStore`, per persistere le credenziali.
Ci sono tre metodi che possiamo chiamare:

- `login`: lo chiamiamo quando vogliamo che l'utente faccia il login. Chiama l'API di login e poi persiste le credenziali in AuthStore.
- `refresh`: usato per aggiornare il token. Effettua le chiamate API e poi le persiste.
- `logout`: svuota l'`AuthStore` e poi porta l'utente alla pagina di login.

Questa è una versione semplificata della mia implementazione. Durante il login ho anche effettuato una chiamata API a un endpoint per ottenere i dati dell'utente (chiamato anche `auth/me`). Non l'ho aggiunto perché la sua implementazione dipende dalla tua architettura ed è fuori dallo scopo del post. Il punto chiave è questo: **dovresti aggiungere tutta la tua logica di business dell'autenticazione qui**, delegando la persistenza ad `AuthStore` e le chiamate API ad `AuthClient`.

### AuthInterceptor

Siamo nell'ultima parte di questo post: possiamo autenticare l'utente e persistere le credenziali nell'`AuthStore`. Possiamo aggiornare il token quando scade. Possiamo fare il logout dell'utente.

Ora ci concentriamo su questi obiettivi:

1. Non passare il token quando chiamiamo un'API pubblica. 
2. Passare il token JWT durante le chiamate API autenticate.
3. Aggiornare il token quando l'`accessToken` scade. Sappiamo che il token scade solo quando effettuiamo qualche chiamata API: quindi quando una chiamata API fallisce, perché il token è scaduto, dobbiamo chiamare l'API di refresh per ottenere il nuovo token, poi dobbiamo rifare la prima chiamata con il token aggiornato.

Tutte queste cose sono gestite dall'`AuthInterceptor`. È una sottoclasse dell'[HTTP Interceptor di Angular](https://angular.io/guide/http#http-interceptors). In breve, **un HTTP Interceptor è uno strato che possiamo aggiungere tra la chiamata API che effettuiamo e la vera HTTP Request fatta dal browser**. In questo modo possiamo iniettare trasparentemente tutti questi comportamenti di autenticazione senza modificare le nostre classi Client.

#### Capire l'HTTP Interceptor

Prima di tutto, dobbiamo capire come implementare un HTTP Interceptor: `AuthInterceptor` dovrebbe implementare l'interfaccia `HttpInterceptor`. Quindi dobbiamo implementare il metodo

```typescript
intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
```

Il primo parametro è la richiesta HTTP che Angular sta per effettuare. Alla fine della nostra logica, dobbiamo chiamare `next.handle(request)` per continuare la richiesta HTTP attraverso il flusso normale.
In altre parole, assumiamo di creare un HTTP interceptor che non fa assolutamente nulla. Il codice minimo che dobbiamo scrivere è questo

```typescript
@Injectable()
export class NoOpInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(request);
    }
}
```

#### Implementazione di AuthInterceptor

Ora facciamo la stessa cosa per il nostro `AuthInterceptor`, ma questa volta dobbiamo aggiungere tutta la logica di autenticazione di cui abbiamo parlato prima.

Diamo un'occhiata alla sua implementazione:

```typescript
import { AuthStoreService } from './auth-store.service';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { tap, mergeMap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { INTERCEPTOR_NO_AUTH_HEADER } from './constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authStore: AuthStoreService,
        private authService: AuthService,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        /* Se la richiesta in arrivo ha lo speciale INTERCEPTOR_NO_AUTH_HEADER,
           significa che non dobbiamo aggiungere il token JWT
        */
        if (request.headers.get(INTERCEPTOR_NO_AUTH_HEADER)) {
            /* Quindi invia semplicemente al prossimo handler la stessa richiesta
               rimuovendo lo speciale header INTERCEPTOR_NO_AUTH_HEADER
            */
            return next.handle(request.clone({
                headers: request.headers.delete(INTERCEPTOR_NO_AUTH_HEADER)
            }));
        }
        // Se l'utente ha fatto il login
        if (this.authStore.isLoggedIn) {
            return next
                // Allora aggiungi il token e continua la chiamata API.
                .handle(this.addTokenToRequest(request))
                .pipe(
                    // Ma se la chiamata è fallita, prova a recuperarla usando il metodo retryWhenExpiredToken
                    catchError(this.retryWhenExpiredToken(request, next)),
                    tap({
                        error: (err: HttpErrorResponse) => {
                            /*
                              Se la chiamata, dopo il nostro metodo di refresh, sta ancora fallendo con
                              lo status code 401 UNAUTHORIZED
                            */
                            if (err.status === 401) {
                                // Allora fai il logout dell'utente, non possiamo fare altro.
                                this.authService.logout();
                            }
                        }
                    }),
                );
        }
        /*
          Se l'utente non ha fatto il login, non fare nulla.
          Non abbiamo nessun token JWT da allegare alla richiesta
        */
        return next.handle(request);
    }

    // Questo metodo viene chiamato solo durante una risposta di errore
    private retryWhenExpiredToken(req: HttpRequest<any>, next: HttpHandler): (response: any) => Observable<any> {
        return response => {
            const refreshToken = this.authStore.refreshToken;
            /* Se lo status code è 401 UNAUTHORIZED e non abbiamo il refresh token,
               oppure lo status code è diverso da 401 UNAUTHORIZED
            */
            if (response.status === 401 && !refreshToken || response.status !== 401) {
                // Non possiamo fare nulla, rilancia semplicemente l'errore e continua.
                throw response;
            }

            // Altrimenti, chiama il backend per aggiornare il nostro token
            return this.authService
                .refresh({ refreshToken })
                .pipe(
                    // Poi richiama la richiesta fallita con il token appena aggiornato
                    mergeMap(() => {
                        return next.handle(this.addTokenToRequest(req));
                    }),
                );
        };
    }

    // Clona semplicemente la richiesta, aggiungendo il token JWT alla richiesta
    private addTokenToRequest(request: HttpRequest<any>): HttpRequest<any> {
        return request
            .clone({
                setHeaders: {
                    'X-JWT-TOKEN': this.authStore.accessToken,
                }
            });
    }
}
```

Prenditi il tuo tempo per leggerlo... Vediamo che il metodo `intercept` è più complesso. **Ho aggiunto tantissimi commenti nel codice**, così è più facile capire cosa succede.

Vediamo se abbiamo raggiunto tutti i nostri obiettivi prefissati:

1. *Non passare il token quando chiamiamo un'API pubblica:* fatto tramite lo speciale header `INTERCEPTOR_NO_AUTH_HEADER`.
2. *Passare il token JWT durante le chiamate API:* fatto grazie al metodo `addTokenToRequest`.
3. *Aggiornare il token quando l'`accessToken` scade:* ottenuto tramite il metodo `retryWhenExpiredToken`.

Il codice non è così lungo, ha più o meno 50 righe. Ma penso che sia abbastanza pieno di concetti complicati di RxJS come [mergeMap](https://www.learnrxjs.io/operators/transformation/mergemap.html), [tap](https://www.learnrxjs.io/operators/utility/do.html), [catchError](https://www.learnrxjs.io/operators/error_handling/catch.html).

[Ho usato una closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) per far funzionare `retryWhenExpiredToken`. Ho creato una funzione che restituisce una funzione. La prima chiamata ottiene la richiesta originale e l'handler `next` e restituisce la funzione che passiamo al metodo `catchError`.

**Scrivere questo codice senza bug in un colpo solo è molto difficile**, anche se non è lungo. Due cose mi hanno aiutato a raggiungerlo:

- **Uso massiccio del sistema di tipi di TypeScript**: TypeScript aggiunge i tipi a JS, grazie al cielo! Aggiungere i tipi a tutto è il modo migliore per evitare bug fastidiosi. Il transpiler può avvisarti il prima possibile se stai restituendo qualcosa di sbagliato. Se metti `any` ovunque, o non aggiungi i tipi per i parametri attesi, sei da solo! Il transpiler non può aiutarti, prima o poi farai un errore. L'unico `any` che vedi in questo codice è perché la firma di `intercept` viene da Angular e non posso farci nulla.
- **Usa il Test Driven Development (TDD)** per la parte cruciale del tuo sistema, o usa il TDD il più possibile. Testare manualmente questo sistema di autenticazione richiede molto più tempo che scrivere qualche unit test. E non c'è niente di peggio di qualcuno che ti chiama dicendo che gli utenti non riescono ad accedere. L'ho fatto usando il TDD e il risultato sono queste piccole classi facili da testare grazie alla [suite di testing di Angular](https://angular.io/guide/testing).

Lo sviluppatore perfetto, che non fa bug, non esiste. **Alcuni sviluppatori sono migliori di altri non perché sono perfetti, ma perché prendono più contromisure per evitare bug**, quindi scrivono codice meno buggato. TypeScript e il TDD sono le contromisure più efficaci che conosco per lo sviluppo frontend. Quindi usali.

Se sei interessato al TDD, ho scritto due articoli sull'argomento. Li trovi qui:

- [Come programmare in Test-Driven Development (TDD) partendo da zero](/it/come-sviluppare-in-test-driven-development-tdd-partendo-da-zero/).
- [Come sviluppare delle API in TDD con Spring Boot](/it/come-sviluppare-rest-api-in-tdd-con-spring-boot/).

#### Aggiungere AuthInterceptor all'app Angular

Dobbiamo ricordarci di aggiungere l'AuthInterceptor alla nostra applicazione.
È molto facile: dobbiamo dichiararlo nel modulo Angular root dell'app

```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth-interceptor';

@NgModule({
  declarations: [...],
  imports: [
    AuthModule,
    ...
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ...
  ]
})
export class AppModule { }
```

E questo è tutto! Ora la nostra app gestisce l'autenticazione JWT del nostro backend!

### Conclusione

Spero che tu ti sia goduto questo viaggio sull'autenticazione JWT + Angular. Questa è la mia implementazione, e ha soddisfatto tutti i miei obiettivi. Spero che questo lavoro ti ispiri a raggiungere i tuoi!

Alla prossima!
