# ChronoKi: decompilation and porting tools survey (2026-11-03)

Method: WebSearch/WebFetch only; nothing downloaded or run. GitHub pages often did not show a last-commit date; "not shown" means exactly that. Items marked UNCONFIRMED were not verified.

## 1. snesrev's method (zelda3, smw, sm)

Sources: https://github.com/snesrev/zelda3 , https://github.com/snesrev/smw , https://github.com/snesrev/sm , https://github.com/snesrev (6 repos: zelda3, smw, sm, glsl-shaders (fork), smw_hacks, sprites-gfx (fork)).

- Approach: a reimplementation in C (about 70-80k lines for zelda3, per secondary coverage), routine by routine, not a decompiler output. README credits spannerism's Zelda 3 JP disassembly and other disassemblies for function and variable names.
- Verification: the C game runs beside the original machine code in an embedded emulator, and compares RAM after each frame. On mismatch, smw/sm save a snapshot (with joypad history, replayable in turbo) to `saves/`. smw README: "runs an emulated version in the background and compares RAM state every frame".
- PPU/DSP: from LakeSnes with "lots of speed optimizations" (README). Python is used only for asset extraction from the user's ROM (ROM not needed after extraction); builds use TCC/clang/MSVC + SDL2.
- Licence: zelda3 MIT (confirmed on page). smw and sm: LICENSE.txt present, type NOT shown by the fetch; UNCONFIRMED. sm says "Early version. It has bugs and the code is messy" (94 commits); smw 39 commits, playable start to end.
- Whether a helper tool translated asm to C: NOT CONFIRMED. The README and wiki home say nothing; HN commenters (informal, https://news.ycombinator.com/item?id=34573418) describe it as C-ified disassembly plus a half-emulator. No snesrev-published decomp tools found. Wiki "About" pages failed to load.
- Last activity: not shown for any snesrev repo.
- Fit for CT: this is the proven template (RotP is built the same way). Cost: it is human/agent effort per routine; the oracle is what makes it safe.

## 2. Disassemblers and analysers (65816)

| Tool | What | Licence | State | CT fit |
|---|---|---|---|---|
| DiztinGUIsh https://github.com/DizTools/DiztinGUIsh | Interactive 65816 disassembler, marks code/data, tracks M/X flags, imports BizHawk/bsnes tracelogs, bsnes usage maps, BizHawk CDL; exports asar-assemblable output | GPL-3.0 | Releases section empty; date not shown | Good for bootstrapping labels; already redundant given ChronoRET |
| ghidra-65816 (achan1989) https://github.com/achan1989/ghidra-65816 | Ghidra processor module | MIT | Archived 2024-03-27, "no longer maintained"; built for Ghidra 9.x era | Avoid |
| joshleaves/ghidra-snes https://github.com/joshleaves/ghidra-snes | Ghidra loader + 65816 language spec (derived from ghidra-65816), LoROM/HiROM/ExHiROM/SA-1 etc. | MIT | 63 commits, no releases, date and Ghidra version not shown; a GitHub topic listing showed a Java Ghidra SNES repo updated 2026-05-01 (which repo: UNCONFIRMED) | Best current Ghidra path; M/X is a known weak spot of Ghidra on 65816 (general knowledge, not verified) |
| IDA 65816 / SNES loader (gocha, Aliandrana) | IDA plugins | not checked | around 2019 | Old; IDA licence cost |
| Binary Ninja | No 65816 architecture plugin found (only Vector35 6502, last push May 2023) | n/a | n/a | Nothing usable; UNCONFIRMED beyond search |
| Mesen2 https://github.com/SourMesen/Mesen2 | Emulator with debugger, trace logger (last 30k instructions or log to disk with format string and conditions), SNES support. https://www.mesen.ca/snes/docs/debugging/tracelogger.html | GPL-3.0 | SourMesen repo is now an archive of ~v2.1.1 (mid-2025); the community continuation is MesenCE https://github.com/nesdev-org/MesenCE (2.2.x, 2026) | The standard trace/oracle debugger. CDL export and DiztinGUIsh import from Mesen: NOT CONFIRMED |
| bsnes-plus / bsnes-hd | Debugger-capable emulators; ChronoRET recommends bsnes-hd or Mesen-S for tracing | not checked | not checked | Optional |
| asar (1.91 used by ChronoRET) | 65816 assembler for byte-exact rebuilds | LGPL (general knowledge; UNCONFIRMED here) | ChronoRET pins 1.91 | Use for matching rebuild only |
| ca65 / WLA-DX | Alternative assemblers | not checked | not checked | No reason to switch from asar |

Matching disassembly, ChronoRET https://github.com/ThisIsAkill/ChronoRET : asar source `asm/rom.asm` assembled onto a blank 4 MiB image; `make gate` = byte-exact diff vs user's US 1.0 ROM, every emitted byte accounted for, readability lint, and a check that blank $00 and $FF images give identical output (proves no ROM bytes are smuggled in). Tools: extract_data.py, code_survey.py, progress.py, c3pack.py. MIT code, no ROM. 825 commits, 8 stars; a re-survey dated 2026-10-14 says all reachable 65816 code (249,251 bytes) is matched; the SPC700 driver (7,153 bytes) and a packed $C3 module (26,393 bytes) are counted separately and excluded. Labels credit dscotton/ct_disassembly (public domain). Strongest single asset for ChronoKi; it also contains the Chrono-specific SPC700 driver status. Caveat: single-author, very young, claims self-reported ("work in progress"); verify by building it.

## 3. Static recompilers and lifters

- **snesrecomp (mstan)** https://github.com/mstan/snesrecomp : 65816 to C framework + shared runtime. Licence PolyForm Noncommercial 1.0.0 (commercial via copyright holder); third parties: LakeSnes MIT, ares-derived coprocessor cores ISC. Beta; 1,644 commits, 171 stars; latest commit shown 2026-11-04 (as reported by the page, one day after today's date; treat as timezone/skew). M/X: analyser tracks M/X width, runtime tripwire checks (docs/TRIPWIRES.md). Indirect jumps: resolved where possible, per-title dispatch config, interpreter-tier fallback otherwise. Timing: host-driven frame/beam loop, validated against a reference core; no cycle model stated. Listed titles include SMW, ALttP, SM, MMX, DKC, EarthBound, Super Mario RPG; "listing is not a claim of validation". Many forks exist (RetroPortingToolKit, Bobbinson, joeblack2k, sp00nznet drop-in hardware, etc.); canonical one not confirmed. NONCOMMERCIAL licence is a flag: fine for a fan port with no revenue, incompatible with MIT reuse; study, do not vendor.
- **ct-recomp (ThisIsAkill)** https://github.com/ThisIsAkill/ct-recomp : the closest thing to a CT-specific tool. Python translator (`recomp/`) with static M/X tracking emits C; C runtime has CPU, bus, cycle model, interpreter, frame scheduler; SDL2 frontend. Licence MIT (2026, Akhil Moola). Third party: PPU/DMA/APU/DSP from snesrev/zelda3 (MIT), SPC700 core from ares (ISC, commit 4cb8d92); Mesen2/bsnes/snes9x only as external debuggers. Status per README: 69.4% (1414 of 2036 known functions) recompiled; 1500-frame boot run runs 97.6% of instructions as compiled C, rest interpreted; 3 of 7 milestones closed; 165 commits, 74 open issues. Lockstep comparison against Mesen 2 headless, state-hash logs, TASVideos movie conversion. Indirect jumps and timing detail not documented on the page (interpreter fallback exists). Output is generated C, not readable hand-written C (readable generated C is roadmap #60). Roadmap: MSU-1, achievements, widescreen, HD Mode 7, 120/144 Hz.
- **snes-native (mitchellcairns)** https://github.com/mitchellcairns/snes-native : described in search as research-quality SNES static recompilation framework; page returned 404 on fetch, so details UNCONFIRMED.
- **N64Recomp-style generic SNES tool / 65816-to-LLVM lifter:** none found other than the above. UNCONFIRMED that none exist.
- **Egg of Time (power-pudu)** https://github.com/power-pudu/egg-of-time : comparison. DS ARM/Thumb, ~9,000 functions each to one C function, compiled by clang to a DLL; code extracted via ds-decomp; runtime supplies 2D engines, reimplemented sound driver, threads, interrupts. MIT. 57 commits; date not shown. Indirect jumps: not on the page (DESIGN.md). Timing: frame-level only, 60 fps with camera interpolation above that. Different CPU (32-bit, no M/X ambiguity) so the 65816 problems (variable-width registers, bank bytes, self-modifying data tables) do not carry over, but its "reimplement the sound driver" choice is a precedent.

## 4. AI-assisted decompilation (2025-2026)

- **BelthasarProject** https://github.com/TemplarServant/BelthasarProject (the fetch for "TemplarServant" resolved; page is a CT port): portable C engine reimplementing CT routine by routine; "oracle" = LakeSnes running the original ROM; a routine is ported when oracle and C agree; lag frames, beam-counter races and cycle counts normalised on both sides for determinism; regression suite `tools/regress.py` with mutation checks. README states much of the RE, code and docs was "written with Claude Code (Anthropic) under the project owner's direction"; ships CLAUDE.md, `.claude/skills/` playbooks, docs/DECISIONS.md. MIT (vendored LakeSnes MIT). 542 commits, 30 stars, 4 forks; Android port experimental; latest dated milestone 2026-10-23. Speed claim: none about development; "60+ fps" is a runtime mod. Credits snesrev/zelda3 as the model.
- **zdiemer/chrono-trigger-reimplemented** https://github.com/zdiemer/chrono-trigger-reimplemented : "readable, hand-written C, not an emulator"; remaining original code runs on a hardware model + 65816 interpreter, and "a C generator turns remaining original code into C at build time from the user's ROM"; attract, field, menu, event and battle systems partly native, validated in shadow mode over 26 input movies. Has CLAUDE.md, AGENTS.md, .claude/skills (AI use implied, not described). Licence NOT stated on page. 1,232 commits, 12 stars; date not shown. No speed claims.
- General LLM decomp (all MIPS/PS1/N64, none 65816): Retro Reversing guide updated 2026-10-25 https://www.retroreversing.com/ai-assisted-decompilation (agent writes C, compiles with the original compiler, byte-compares; tools decomp.me, decomp-permuter, m2c, asm-differ, Ghidra/GhidrAssist; decomp.wtf discontinued 2026-10-15; no timing figures; no 65816 content). Chris Lewis, Snowboard Kids 2: matched code from about 25% to 58% with coding agents (Feb 2026) https://blog.chrislewis.au/the-long-tail-of-llm-assisted-decompilation/ . Mizuchi pipeline test: 74% of 60 functions matched https://gambiconf.substack.com/p/can-llms-really-do-matching-decompilation . Academic: ICLR 2026 SK2Decompile; a study found LLM decompilers often recompile but change logic (arXiv 2609.05370, as returned by search; not opened). Lesson: "passes tests" is not "faithful", so a lockstep oracle is mandatory. LLM4Decompile and decomp.me do not target 65816; not verified beyond search.
- Relevance to CT: the byte-matching workflow does not apply (hand asm, no compiler). What transfers is the oracle-in-lockstep loop that BelthasarProject and snesrev use, with an agent doing the per-routine translation. Both CT projects show agents are in practice used for this.

## 5. SPC700 / DSP audio options

Options: (a) run the original sound driver on an emulated SPC700 + DSP (what snesrev, ct-recomp, BelthasarProject do; exact, uses the game's own driver and samples from the ROM); (b) reimplement the driver and sequencer in C and drive a sample mixer (Egg of Time-style; flexible, but large work and risk of audible differences; no 65816-era precedent found).

| Library | Licence | State | Notes |
|---|---|---|---|
| LakeSnes SPC/DSP https://github.com/angelo-wf/LakeSnes | MIT | Archived 2023-12-02; fork by Dinkc64 more active | SPC side cycle-accurate, DSP per-sample; README says "not fully accurate" overall; CPU-SPC communication not cycle-accurate; SPC test register not emulated |
| snesrev/zelda3 APU/DSP (LakeSnes derived, optimised) | MIT | Current for zelda3 (date not shown) | What ct-recomp vendors (commit fbbb3f9) |
| ares SPC700 core | ISC (per ct-recomp THIRD_PARTY); ares overall licence not checked | ct-recomp uses commit 4cb8d92 | Accurate core, clean licence |
| blargg snes_spc / SPC_DSP https://github.com/yupferris/snes_spc (mirror) | LGPL | old, stable | Highly accurate DSP usable standalone; LGPL means dynamic linking or relinkable |
| Game_Music_Emu | LGPL 2.1+ | not checked | Music-player grade, not for a live driver |
| bsnes / higan / snes9x cores | not checked | UNCONFIRMED | Not examined |

Recommendation: (a), using the zelda3-derived DSP (MIT) plus ares SPC700 core (ISC), because ChronoRET reports the SPC700 driver as separately tracked (7,153 bytes), meaning it can be extracted from the ROM at runtime and nothing must be reimplemented now. Reimplementation can come later for features (stem volume, MSU-1 as ct-recomp planned).

## Recommended toolchain for ChronoKi

1. Oracle and PPU/DSP: zelda3 lineage (MIT) PPU/DMA/DSP + ares SPC700 (ISC) - the same core that snesrev and ct-recomp prove at frame-exact accuracy; MIT/ISC are safe to vendor.
2. Reference symbols and structure: ChronoRET (MIT) + dscotton/ct_disassembly (public domain) - 100% of reachable 65816 code is claimed matched; build with asar 1.91 and run its `make gate` to confirm before relying on it.
3. Debug and trace: MesenCE (GPL; use as an external tool only, never vendor) - trace logger with conditions for finding which routine diverges.
4. Port method: snesrev-style routine-by-routine C with per-frame RAM compare, the method BelthasarProject (MIT) and zdiemer's project follow; add input-movie replays (TASVideos) as regression, as ct-recomp and zdiemer do.
5. Bootstrap/hybrid: ct-recomp (MIT) generated C or a 65816 interpreter fallback for not-yet-ported routines, so the game is playable early - same as zdiemer's design; study snesrecomp (PolyForm NC) but do not vendor.
6. Agents: Claude Code per routine, gated by the oracle and a mutation-checked regression suite (BelthasarProject model) - speed with a faithful-check, since LLM output can pass compile and still diverge.
7. Avoid: Ghidra 65816 (archived/immature), DiztinGUIsh (ChronoRET already supplies labels), Binary Ninja/IDA (no usable plugin / cost).

Open point for the owner: BelthasarProject, ct-recomp, ChronoRET and zdiemer's project are all 2026 and young; licences and code should be reviewed before depending on any. Also decide whether to adopt one of them as upstream rather than start fresh; this survey did not assess code quality.
