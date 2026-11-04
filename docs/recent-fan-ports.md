# Recent unofficial Chrono Trigger PC ports (checked 2026-11-03)

Dates are from the GitHub API (created_at / pushed_at) unless noted. Sources: GitHub repo pages and api.github.com, WebSearch, decomps.net / decompdex / playported listings. Note: API pushed_at shows 2026-11-04 UTC, which is just timezone rollover.

Verdict: YES. A cluster of projects appeared Aug-Nov 2026; almost all started Sep-Oct 2026. Several are AI-assisted (Egg of Time says Claude did the analysis and recompiler).

## Candidates
1. Egg of Time - https://github.com/power-pudu/egg-of-time (also power-pudu/egg-of-time-recomp)
   - Author power-pudu; README says Claude (Anthropic) wrote analysis/recompiler/runtime.
   - Approach: static recompilation of the DS ARM9 code to C plus a small DS-hardware runtime, SDL3. Win/Linux tested, macOS untested. USA YQUE ROM, player supplies it; ships no ROM/code/assets.
   - Created 2026-10-26; releases v0.1.1 (10-26) to v0.7.0 (2026-11-03: graphics and font mods); v0.6.0 controls remap and shader mods. 82 stars, 57 commits.
   - State: playable from the start (sound, music, cutscenes); no DS 3D, Wi-Fi, mic.
   - Licence: MIT for source (LICENSE.md, third-party keep own); API says NOASSERTION.
2. zdiemer/chrono-trigger-reimplemented - https://github.com/zdiemer/chrono-trigger-reimplemented
   - SNES US; readable hand-written C, ported routine by routine, validated against a 65816 interpreter on 26 input movies. C generator for the rest.
   - Created 2026-09-14; last push 2026-11-03; 1,232 commits, 12 stars. WIP (attract, field, menu, event, battle partly native). No licence file. BYOROM (CRC32 2D206BF7).
3. TemplarServant/BelthasarProject - https://github.com/TemplarServant/BelthasarProject
   - Native C reimplementation of SNES, optional widescreen, 60+ fps. Created 2026-10-11, pushed 2026-11-04; 30 stars. Only API-search description read; repo page NOT opened (licence/ROM handling unconfirmed).
4. fariasheron/cronotrigger-decomp - https://github.com/fariasheron/cronotrigger-decomp
   - SNES US C decompilation (~2,000 routines) on snesrecomp runtime (Matthew Stanley's). Licence PolyForm Noncommercial 1.0.0. 1 commit, 2026-10-30, 0 stars. BYOROM.
5. ThisIsAkill/ChronoRET - https://github.com/ThisIsAkill/ChronoRET
   - Byte-exact matching disassembly (65816 asm, reassembles to identical ROM); claims 100% of reachable code matched (re-survey 2026-10-14; unverified). Created 2026-08-07, pushed 2026-10-30, 825 commits, 8 stars, MIT. Documentation on the Kajar wiki. Not a port by itself.
6. Schala/KajarEngine - https://github.com/Schala/KajarEngine (forum topic chronocompendium.com/Forums/index.php?topic=14211.0)
   - Bevy/Rust engine reimplementation, but reads the Steam (2018) data, not SNES ROM. GPL-3.0. Last push 2023-08-28; dormant. Not new.
7. Minor/unverified (API listing only, 0 stars, not opened): grabbiel/chrono (Swift decomp+port of SNES, created 2026-10-18, pushed 11-01); ct-rebuild/ct-rebuild (2026-10-26, engine rebuild); omegakatana92/Chrono-Trigger-Recomp (2026-10-22, empty description); NaGaa95/ct_nx (Switch port, 2026-06-23, 50 stars; platform not PC).
8. Not ports: rsc-pl DS KWhazit fan translation (notes a PC port planned later); rachelb-2527/chrono-trigger-desktop (helper); ctrando randomizer; trainer/accessibility/HD-2D "Time Debt" repos.
   Aggregators listing Egg of Time: decompdex.com/port/egg-of-time/, playported.com/ports/943-chrono-trigger/, boburning/portcove issue #3740, decomps.net.

## Takedowns
None found for any 2026 project. Only old Square Enix cease-and-desists: Chrono Resurrection (2004), Crimson Echoes and Chrono Compendium rom-hack pages (2009) (Engadget/Kotaku/Slashdot 2009). No DMCA found against Egg of Time, etc., as of 2026-11-03.

## Not checked / unconfirmed
- Reddit, Hacker News, Chrono Compendium (current), ResetEra, GBAtemp, YouTube, romhacking.net: not searched directly (WebSearch only; results gave nothing from them except old GBAtemp translation thread).
- API search output truncated (18 of 197 hits read), so more small repos may exist.
- Exact first-commit dates, Belthasar/other repo details, and whether the repos' licences cover game-derived tables.
- Whether any repo was taken down after 11-03.
