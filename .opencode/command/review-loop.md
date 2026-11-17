---
description: Run an iterative review, decide, fix, verify and commit loop until no useful safe findings remain.
agent: build
---

Run a review → decide → fix → verify → commit loop on this repository.

Arguments: $ARGUMENTS
Optional interpretation: first token = commit/range to review (default: the most recent commit, including any uncommitted changes); second token = max rounds (default: 5).

Setup:
- If the working tree is dirty, commit it first as a checkpoint with a concise message before starting.
- Resolve and record the current HEAD sha. This is the baseline for round 1.

For each round, up to the max:
1. Review: launch these three subagents in parallel with `task`, passing them the repo path, the commit/range under review, and the hard constraints below:
   - `clean-code-reviewer`
   - `security-reviewer`
   - `astro-reviewer`
2. Decide: launch `review-decider` with all three reports and the same context. It must return APPLY/REJECT with exact minimal changes.
3. If the decider says there are no APPLY items or no useful safe change remains, stop the loop.
4. Apply each APPLY item yourself using the smallest possible edits. Do not make unrequested refactors.
5. Verify: run the project's check and build commands (for this repo: `npm --prefix astro run check` and `npm --prefix astro run build`). If anything fails, fix or revert the change; never commit a broken build. If visual or URL output could be affected, verify parity against the existing built output before committing.
6. Commit the applied changes with a concise conventional commit message. If nothing was applied, stop.
7. Re-record HEAD and repeat from step 1 on the new commit.

Stop early if verification fails twice in a row, if the decider reports no useful safe change, or at the max round count.

Hard constraints unless the caller explicitly overrides them in `$ARGUMENTS`:
- Preserve exact URLs and pixel-perfect visual parity with the existing built site.
- Fix genuine bugs even if the original had them, but say so in the commit/report.
- No CI, Netlify, or production/deployment config changes.
- Never commit secrets or generated build output.

Final report to the user: commits created, findings applied, notable findings rejected with reasons, and verification status.
