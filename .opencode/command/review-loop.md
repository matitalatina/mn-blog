---
description: Run an iterative review, decide, fix, verify and commit loop over everything not yet pushed to the default branch.
agent: build
---

Run a review → decide → fix → verify → commit loop on this repository.

Arguments: $ARGUMENTS
Optional interpretation: first token = base ref to compare against (default: the pushed default branch, resolved as `origin/master` then `origin/main`); second token = max rounds (default: 5).

Setup:
- If the working tree is dirty, commit it first as a checkpoint with a concise message before starting.
- Resolve the base: use the first token if given, otherwise the first existing of `origin/master`, `origin/main`, `master`, `main`. Record it as BASE. Do not fetch or push.
- The range under review is `BASE..HEAD`: every commit that is not on the pushed default branch, plus any uncommitted changes. BASE stays fixed for the whole loop; after each fix commit the range grows automatically as HEAD advances.

For each round, up to the max:
1. Review: launch these three subagents in parallel with `task`, passing them the repo path, BASE, the range `BASE..HEAD`, and the hard constraints below:
   - `clean-code-reviewer`
   - `security-reviewer`
   - `astro-reviewer`
2. Decide: launch `review-decider` with the same repo path, BASE, range, all three reports, and the same context. It must return APPLY/REJECT with exact minimal changes.
3. If the decider says there are no APPLY items or no useful safe change remains, stop the loop.
4. Apply each APPLY item yourself using the smallest possible edits. Do not make unrequested refactors.
5. Verify: run the project's check and build commands (for this repo: `npm run check` and `npm run build`). If anything fails, fix or revert the change; never commit a broken build. If visual or URL output could be affected, verify it against the current live site before committing.
6. Commit the applied changes with a concise conventional commit message. If nothing was applied, stop.
7. Keep the same BASE and repeat from step 1 on the expanded range `BASE..HEAD`.

Stop early if verification fails twice in a row, if the decider reports no useful safe change, or at the max round count.

Hard constraints unless the caller explicitly overrides them in `$ARGUMENTS`:
- Preserve the live site's existing URLs and rendered output unless the caller explicitly asks for a change.
- Fix genuine bugs, and call out any intentional behavior change in the commit/report.
- No CI, Netlify, or production/deployment config changes.
- Never commit secrets or generated build output.

Final report to the user: BASE and commits reviewed, commits created, findings applied, notable findings rejected with reasons, and verification status.
