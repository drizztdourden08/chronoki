# Hand-over: Chrono → ChronoKi (from the old Chrono lead, 2026-11-03)

## The name (owner's pick, in chat)
**ChronoKi**. Ki (機 / き, "kee") means the occasion or impetus that makes something happen, an opportunity,
the right moment. That is the figurative sense of "trigger". The owner wants the Overlord to redo the folder,
the board and everything else, archive the old lead thread ("Chrono"), and start a new lead under the right name.

The owner did not pick from my options. My options and the collision check are below for the record.

## State at hand-over
- Folder: X:/chrono-port, the main checkout. It is git-initialised with **no commits**, on branch `master`
  (the main branch should be `main`). It holds the rendered ai-config, an untracked `.gitignore`,
  `.claude/launch.json` (the "Chrono board" shortcut, url http://chrono.localhost:47615) and
  `docs/naming-candidates.md`, which is untracked.
- Board: key `chrono`, display name "Chrono", at C:/Users/drizz/.coord/chrono/board.json.
  - I-1 "Find the project a name": done. D-1 records ChronoKi, Q-1 is answered (F-1).
  - Agents A-1 (sonnet, research) and A-2 (haiku, collision check) both finished.
  - Notice: launcher-master-missing. No launcher is defined yet (no app exists yet).
- Project CLAUDE.md says the board key `chrono` stays when the name changes. The owner's words ("redo the folder,
  board and everything") may override that. The Overlord decides.
- Nothing has been pushed, published or created remotely. No game data or ROM is in the folder.

## Research the new lead can reuse
- Development: "Dream Project", the "Dream Team" of Sakaguchi, Horii and Toriyama. Kato wrote the story,
  Mitsuda scored it. Released 11 March 1995. Japanese title クロノ・トリガー. Chrono comes from the Greek khronos.
- Fan names already taken: Temporal Flux, Crimson Echoes, Resurrection, Flames of Eternity, Jets of Time,
  Wings of Time, Egg of Time (a DS static recompilation), Kajar Engine (a Rust reimplementation), Eternal Nightmare,
  Prophet's Guile, Radical Dreamers. No SNES decompilation project was found. That matters for the port's technical plan.
- "ChronoKi" was NOT collision-checked. A quick check is worth doing before anything goes public (USPTO TSDR,
  UK IPO, GitHub).
- The full list of 20 candidates is in docs/naming-candidates.md (copy: chrono-naming-candidates.md in this folder).

## Next for the new lead
1. Collision-check "ChronoKi".
2. Read RotP's guide, README and docs/, then plan the port: tech stack decision on the board. There is no SNES
   decomp, so the approach is an open design question.
3. Define the master launcher once an app exists.
