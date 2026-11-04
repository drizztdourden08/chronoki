# Port approach (I-2)

How ChronoKi gets *Chrono Trigger*'s game code running natively, and what the app around it is.
The research is in `port-research.md` (RotP's stack, the approaches) and `recent-fan-ports.md`
(the fan ports that appeared Aug to Nov 2026). Facts checked on the GitHub API on 2026-11-03.

## What changed: CT now has fan ports

There was no Chrono Trigger decompilation a few months ago; now there are several, all from
2026, small teams, much of it written with AI help, none verified playable start to finish:

| Project | What | Licence | Since |
|---|---|---|---|
| ChronoRET (ThisIsAkill) | Byte-exact matching 65816 disassembly of the SNES US ROM, 3,736 functions | MIT | 2026-08-07 |
| BelthasarProject (TemplarServant) | Native C reimplementation checked frame by frame against an embedded SNES core; field, battle, menus, overworld, sound run; widescreen, 60+ fps; BYOROM with SHA-1 check | MIT (LICENSE checked; bundles LakeSnes MIT, SDL2 zlib, ImGui MIT) | 2026-10-11 |
| ct-recomp | 65816-to-C static recompiler, about 69% of functions, SDL2 frontend | MIT | 2026 |
| chrono-trigger-reimplemented (zdiemer) | Hand-written C validated against the ROM | none, so not reusable | 2026-09-14 |
| Egg of Time (power-pudu) | Static recompilation of the **DS** version, playable, v0.7.0 | unclear | 2026-10-26 |
| dscotton/ct_disassembly | Partial disassembly, RAM labels | CC0 | older |
| Kajar Engine (Schala) | Rust/Bevy engine on the Steam data; dormant since 2023 | GPL-3 | 2023 |

No Square Enix takedown of any of them was found (only the 2004 and 2009 fan-game ones).

## RotP's pattern, which ChronoKi follows

RotP vendors snesrev's zelda3 C decompilation (`core/zelda3`), adds its own C glue, compiles it to
WASM with Emscripten, and runs it in an Electron + React shell: a Brock app drawn with Tessera,
layered core, then a game-core bridge, then `@rotp/*` packages, then `apps/desktop`. The player
imports a SHA-1-checked ROM once; a pure-TS extractor writes an asset file the core loads.
Brock already ships `brock-plugin-snes` (wasm build, `snes rom check`, save-state vault).

So the real question is **which game core ChronoKi vendors**, the way RotP vendors zelda3.

## The options

| # | Core | Time to a playable app | Gives | Risk |
|---|---|---|---|---|
| 1 | **Vendor BelthasarProject** (MIT C), ChronoKi builds the Brock/Tessera app around it | 1 to 2 months | Native C core, widescreen, 60 fps, mods through C hooks, RotP's shape exactly | A weeks-old repo with one main author; we track or fork it |
| 2 | Our own hybrid: an MIT emulator core (LakeSnes) first, then our own C replacing subsystems, on ChronoRET's symbols | 1 to 2 months (emulated), 12+ months native | Full ownership of the code | Duplicates what Belthasar already did |
| 3 | Static recompilation with ct-recomp (MIT) | 3 to 6 months | Exact original behaviour | Hard to mod, widescreen needs hooks; 31% of functions to go |
| 4 | Our own hand decompilation on ChronoRET | 12 to 24 months | The cleanest code | Longest; others are ahead |
| 5 | Pause ChronoKi and watch the fan ports | 0 | Nothing spent | No ChronoKi |

Estimates are the research agent's and mine, not sourced.

## Recommendation: option 1

It is RotP's own method: take the best permissive C core, keep it in its own package, and spend
our effort on the app (launcher, ROM import, saves, settings, Tessera UI, mods). The core can be
swapped later (for ct-recomp or our own) behind the same bridge. First step either way: a check
build of BelthasarProject with a legally obtained ROM on the owner's machine (the ROM stays out
of the repo), to confirm its claims and its licence before we vendor it.

The decision is on the board as a question on I-2.

## Toolchain (I-5, details in `decomp-tools.md`)

snesrev's zelda3 method, still the reference: rewrite routine by routine in C using an existing
disassembly for names, run the original code beside it in an embedded emulator and compare RAM
every frame, PPU and DSP from LakeSnes. No asm-to-C helper tool of his is documented. What ChronoKi
uses, whichever core is chosen:

| Piece | Tool | Licence | Why |
|---|---|---|---|
| PPU and DSP | zelda3-lineage LakeSnes code | MIT | Frame-exact, already what RotP runs, safe to vendor |
| SPC700 | ares core (as ct-recomp vendors it); run the game's own sound driver | ISC | Exact music without reimplementing the driver |
| Names and structure | ChronoRET (matching asar disassembly) + dscotton/ct_disassembly labels | MIT, CC0 | Every routine already found and named |
| Verification | per-frame RAM compare against the oracle, input-movie regression | ours | The zelda3/smw method; catches every divergence |
| Debugging | MesenCE trace debugger, external only | GPL-3, never vendored | Best 65816 traces and CDL |
| Routine work | Claude Code per routine, gated by the oracle | n/a | How Belthasar and zdiemer got this far this fast |
| Fallback | ct-recomp output or an interpreter for routines not yet in C | MIT | Always playable while the C grows |

Not usable as a base: snesrecomp and fariasheron's decomp (PolyForm Noncommercial), zdiemer's
code (no licence), DiztinGUIsh and Mesen inside the app (GPL-3). Ghidra's 65816 module is
archived; Binary Ninja has none; 2026 LLM-decomp research is all MIPS/PS1.
