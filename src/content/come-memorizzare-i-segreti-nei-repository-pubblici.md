---
layout: post
title: Come memorizzare i segreti nei repository pubblici
excerpt: È possibile farlo in modo sicuro? La risposta è sì!
image: img/secrets-public-repo/secrets_in_public_repo.jpg
author: [Mattia Natali]
date: 2022-11-27T08:04:12.952Z
tags: 
  - Dev
  - Auth
  - How-to
draft: false
---

Prima o poi proviamo tutti questo dolore: stai lavorando duramente sul tuo repository git. Per un motivo qualsiasi cambi PC ma vuoi comunque continuare a lavorare al tuo progetto.
Quindi scarichi il repository usando `git clone`. Sei pronto a partire, ma poi ti blocchi perché non ricordi i segreti che avevi messo nel file `.gitignore`.

Fortunatamente ora esiste una soluzione. Si chiama [git-crypt](https://www.agwa.name/projects/git-crypt/).

Git-crypt cifra i tuoi segreti prima di fare il push delle modifiche sul branch remoto, e li decifra quando scarichi da esso. Quindi, dopo averlo configurato, tutto è completamente trasparente. Ti dimenticherai di avere dei segreti nel repository!

## Bootstrap

Per iniziare devi installarlo. Su Mac puoi eseguire il seguente comando nel terminale dopo aver installato il gestore di pacchetti [brew](https://brew.sh/)

```bash
brew install git-crypt
```

Poi devi andare nel tuo repository pubblico dove vuoi mettere i segreti. E inizializzare `git-crypt`

```bash
cd <YOUR_REPO_PATH>
git-crypt init
```

## Aggiungere i segreti

Ora devi aggiungere il file `.gitattribute` nella cartella principale del repository. In questo file dichiari i file e le cartelle che vuoi mantenere segreti.
Questo è un esempio di file `.gitattribute`

```bash
# Rendi segreto il file .env
.env filter=git-crypt diff=git-crypt

# Rendi segreti tutti i file che terminano con .key
*.key filter=git-crypt diff=git-crypt

# Rendi segreti tutti i file contenuti nella cartella secretdir
secretdir/** filter=git-crypt diff=git-crypt
```

**Dopo** aver creato il file `.gitattribute`, puoi mettere i segreti nel posto che hai appena dichiarato. Se metti i file prima del `.gitattribute`, i tuoi segreti non verranno cifrati!
Prima di fare commit di qualsiasi cosa, puoi avere la conferma che i file verranno cifrati usando il comando `git-crypt status`

```bash
# Mostra se i file sono cifrati o meno
git-crypt status

# Mostra solo i file cifrati
git-crypt status -e

# Mostra solo i file non cifrati
git-crypt status -u
```

Se un file era già presente, non verrà cifrato. Devi eseguire il comando `git-crypt status -f`. Mi ripeto: se stai usando questo comando, significa che il file era già nel tuo repository in chiaro.
Quindi devi ruotare i segreti contenuti in quei file. Altrimenti, è molto facile per un attaccante vedere i segreti semplicemente guardando i commit precedenti.

Ora puoi fare commit e push. Vedrai solo alcuni file binari cifrati nel tuo repository pubblico! Ma sarai in grado di vederli localmente.

## Spostare la chiave simmetrica su un altro dispositivo

Fin qui tutto bene... Ma se cloni il repository altrove, scaricherai i file cifrati. Quindi come possiamo decifrare di nuovo i file?
Per rispondere a questa domanda dobbiamo svelare un po' di magia. `git-crypt` decifra i file usando una chiave simmetrica.

Durante l'inizializzazione con `git-crypt init`, ha creato la chiave simmetrica e l'ha messa in `<YOUR_REPO_PATH>/.git-crypt/keys/default`.
Puoi esportarla facilmente con questo comando

```bash
git-crypt export-key /path/to/keyfile
```

con questa chiave puoi decifrare anche sugli altri tuoi dispositivi. Quindi tienila al sicuro.
Per decifrare un repository protetto con `git-crypt` puoi usare il comando

```bash
git-crypt unlock /path/to/keyfile
```

## Usare le chiavi GPG

So cosa stai pensando: "Dai... ho più di 30 repository. Non posso memorizzare e spostare le chiavi per ogni repo! Dovrebbe esserci un modo più semplice per gestirle.". Esiste, davvero!

Puoi usare la tua chiave GPG per sbloccare il tuo repository. Se non ne hai una, puoi seguire la [guida di Github per creare la chiave GPG](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key).

Tutto ciò che devi fare è permettere alla tua chiave GPG di decifrare il repository

```bash
# Da questo momento puoi sbloccare usando <YOUR_GPG_KEY>
git-crypt add-gpg-user <YOUR_GPG_KEY_ID>
```

Per trovare la tua chiave GPG, puoi usare il seguente comando. Presumo che tu abbia già installato [GnuPG](https://gnupg.org/index.html)

```bash
gpg --list-secret-keys --keyid-format=long
```

Poi, se cloni il tuo repository altrove, puoi sbloccarlo con

```bash
git-crypt unlock
```

git-crypt sarà abbastanza intelligente da cercare la chiave GPG sulla tua macchina. Se la trova, decifrerà tutto!

### Come funziona la modalità GPG

... Ma come funziona? Presumo che non ti piaccia la magia.

Quando scrivi

``` bash
git-crypt add-gpg-user <YOUR_GPG_KEY_ID>
```

`git-crypt` cifrerà la chiave simmetrica usando la tua chiave GPG pubblica, e farà il commit nel tuo repository nella cartella `.git-crypt/keys/default/0`.

Poi, quando scrivi

```bash
git-crypt unlock
```

`git-crypt` troverà la tua chiave GPG sul tuo Mac, decifrerà la chiave simmetrica che ha salvato in `.git-crypt/keys/default/0` usando la tua chiave GPG privata. Infine, decifrerà i segreti usando la chiave simmetrica appena decifrata.

Spero di esserti stato d'aiuto nel trovare un buon modo per gestire i segreti nei tuoi repository. Lo uso intensamente sia nei miei progetti hobbistici che al lavoro. Sono così soddisfatto che volevo condividerlo con voi.

Alla prossima!
