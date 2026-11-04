# Audio settings breakdown: RotP to ChronoKi

Read-only comparison (code only, nothing built or launched). Sources: RotP
`apps/desktop/src/screens/game/gameplay/audio.settings.ts`, `settings-controls/audio/*`, `title-bar/volume.action.ts`,
`main.constants.ts`, `packages/features/src/feature-registry/audio.constants.ts`, `packages/game-core/src/settings/default-settings.ts`;
ChronoKi `apps/desktop/src/screens/game/gameplay/audio.settings.ts`, `screens/game/extras/enhancements.settings.ts`,
`title-bar/volume.action.ts`, `main.constants.ts`, `settings.constants.ts`, `views/GameSession/behavior/useCoreSettings.ts`,
`packages/game-core/src/port/*`, `core/reconnect/sdl_audio.c`, `core/wasm-build/ck_api.c`.

Status key: **Now** = ChronoKi already does it. **App-side** = needs only app code. **Engine hook** = out of scope for now.

## 1. RotP structure

- One Audio screen (`gameplay/audio`, icon `volume-2`, order 2) with three sections: **Volume**, **Music Packs**
  (subsections Replacement music, Replacement sounds), **Audio Device**.
- Volume rows use `VolumeRow` (Tessera `VolumeControl`: slider, step 5, value shown, mute button) writing `<x>Volume` and `<x>Muted`.
- Title bar: `volumeTitleBarItem()` plus `volumeFromSettings({ value: 'masterVolume', muted: 'masterMuted', max: 100 })` on `BrockApp`
  gives the mute button, slider menu and the main menu's Mute/Volume rows.
- Gates (`is-audio-disabled.ts`): group volumes disabled unless `perGroupVolume`; pack keys disabled in vanilla-safe mode or manual
  mode with MSU off; device keys disabled in auto mode or vanilla-safe; `msuConfigMode`/`enableMSU` disabled in vanilla-safe.
  The only audio feature gate is `perGroupVolume` (`affectsVanillaParity`, live).
- Sound effects: RotP has no UI blip sounds; `game/original-sound/play-original-sound.ts` is the MSU Studio preview player (ALttP-only).

## 2. Setting-by-setting table

| # | RotP page / section | Label | Description (RotP) | Control | Range / options | RotP default | RotP gate | ChronoKi status | Target ChronoKi label / file / default |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Audio / Volume | Master Volume (`masterVolume`) | Controls the overall game volume, so it affects all audio output | VolumeControl slider | 0 to 100, step 5 | 100 | none | **Now**: slider exists as a plain `range` (step 5, `%`); engine takes `[sound] volume` 0-100 | Keep "Master Volume", `screens/game/gameplay/audio.settings.ts`, default 100 (`settings.constants.ts`); control upgraded in row 2 |
| 2 | Audio / Volume | Master mute (`masterMuted`, button on row 1) | Mute button beside the slider | Toggle inside VolumeControl | on/off | false | none | **App-side**: setting, title-bar mute and ini `mute=` exist; the Audio page row has no mute button | Same "Master Volume" row as a RotP-style `VolumeRow`, keys `masterVolume` + `masterMuted`, `settings-controls/audio/VolumeRow.tsx` (new), default false |
| 3 | Title bar | Volume button, slider menu, Mute/Volume menu rows | Brock built-in | `volumeTitleBarItem()` + `VOLUME` prop | 0 to 100 | n/a | none | **Now** (`title-bar/volume.action.ts`, `main.constants.ts`, `.brock/title-bar.ts`). `docs/parity/data-and-shell.md` saying it is missing is stale | No change |
| 4 | Audio / Volume | Independent Music / SFX (`perGroupVolume`) | Mix music and sound effects separately | Toggle (feature gate) | on/off | false | `affectsVanillaParity`, locked in vanilla-safe | **Engine hook**, out of scope (the core hands the host one mixed PCM buffer) | Out of scope |
| 5 | Audio / Volume | Music Volume (`musicVolume`, `musicMuted`) | Music level, original soundtrack or pack | VolumeRow | 0 to 100, step 5 | 100, unmuted | needs `perGroupVolume` | **Engine hook**, out of scope (Music/SFX split) | Out of scope |
| 6 | Audio / Volume | Ambience Volume (`ambientVolume`, `ambientMuted`) | Rain, waterfalls and wind played by a pack | VolumeRow | 0 to 100, step 5 | 100, unmuted | needs `perGroupVolume` | **Engine hook**, out of scope; **ALttP-only** (pack ambience) | Out of scope |
| 7 | Audio / Volume | SFX Volume (`sfxVolume`, `sfxMuted`) | Sound-effects level | VolumeRow | 0 to 100, step 5 | 100, unmuted | needs `perGroupVolume` | **Engine hook**, out of scope (Music/SFX split) | Out of scope |
| 8 | Audio / Music Packs / Replacement music | Configuration (`msuConfigMode`) | Auto matches the assigned pack; Manual sets each option | Choice | auto, manual | auto | disabled in vanilla-safe | **Engine hook**, out of scope (MSU-1); **ALttP-only** | Out of scope |
| 9 | same | Pack Format (`enableMSU`) | MSU, Deluxe, OPUZ, Deluxe OPUZ | Select / detected summary | false, true, deluxe, opuz, deluxe-opuz, msul | false | vanilla-safe; manual with MSU off | **Engine hook**, out of scope (MSU-1); **ALttP-only** | Out of scope |
| 10 | same | Resume Tracks (`resumeMSU`) | Return to an area's music where it left off | Toggle | on/off | true | pack-dependent | **Engine hook**, out of scope (MSU-1); **ALttP-only** | Out of scope |
| 11 | same | Reset At Title Screen (`resetMSUAtTitle`) | Title screen forgets remembered positions | Toggle | on/off | true | pack-dependent | **Engine hook**, out of scope (MSU-1); **ALttP-only** | Out of scope |
| 12 | Audio / Music Packs / Replacement sounds | Replace Ambient Sounds (`packReplaceAmbient`) | Pack takes over looping background sounds | Toggle | on/off | true | pack-dependent | **Engine hook**, out of scope (MSU-1); **ALttP-only** | Out of scope |
| 13 | same | Replace Sound Effects (`packReplaceSfx`) | Pack takes over one-shot effects | Toggle | on/off | true | pack-dependent | **Engine hook**, out of scope (MSU-1); **ALttP-only** | Out of scope |
| 14 | Audio / Audio Device | Sample Rate (`audioFreq`) | Output rate, 44100 Hz MSU, 48000 Hz OPUZ | Segmented | 22050, 32000, 44100, 48000 | 44100 | disabled in auto mode or vanilla-safe | **Engine hook**, out of scope (audio output device); ChronoKi's core is fixed at 48 kHz S16 stereo (`CT_SAMPLE_RATE`, `sdl_audio.c`) | Out of scope |
| 15 | same | Channels (`audioChannels`) | Mono or stereo | Segmented | 1, 2 | 2 | same as row 14 | **Engine hook**, out of scope (fixed stereo) | Out of scope |
| 16 | same | Buffer Size (`audioSamples`) | Latency against stability | Slider, 4 steps | 512, 1024, 2048, 4096 | 2048 | same as row 14 | **Engine hook**, out of scope (the "device" is a linear buffer drained once per frame) | Out of scope |
| 17 | Device row | MSU rate mismatch callout | Warns when pack Hz differs from output Hz | Callout | n/a | n/a | manual mode only | **Engine hook**, out of scope; **ALttP-only** | Out of scope |
| 18 | ChronoKi Enhancements / Sound (no RotP equivalent) | Instant Sound Uploads (`gate:instantUploads`) | Removes the short pause when a song or sound set loads | Gate toggle (`gateItem`) | on/off | off | `affectsVanillaParity`: locked while `original` is on | **App-side**: works today (ini `[timing] instant_sound_uploads`), needs moving | Move to Audio, section "Sound", `screens/game/gameplay/audio.settings.ts`, label "Instant Sound Uploads", default off |

### Counts

- Doable now, no change: **2** (rows 1, 3).
- App-side work: **2** (row 2 mute button on the page, row 18 move into Audio).
- Engine hook, out of scope: **14** (rows 4 to 17). Of these, rows 6, 8 to 13 and 17 are also ALttP-only.

## 3. "Sounds" options currently in Enhancements

`apps/desktop/src/screens/game/extras/enhancements.settings.ts` has one section, `{ id: 'sound', title: 'Sound', items: [gateItem('instantUploads')] }`,
and the screen's keyword list includes `'uploads'`. The owner wants it in Audio. Plan:

- Remove the `sound` section from Enhancements (Motion and Widescreen stay) and drop `'uploads'` from its `keywords`.
- Add to Audio a second section `{ id: 'sound', title: 'Sound', items: [gateItem('instantUploads')] }` after Volume, and add `'uploads'`,
  `'instant'` to Audio's `meta.keywords`.
- Gate key, feature id, ini key, label, description, hint and lock behaviour do not change; only the screen moves.
- `.brock/search.ts` and `.brock/screens.ts` are generated from the screens; the lead or checker regenerates them with the project's brock verb
  (coders do not build).

## 4. Volume handling notes

- Settings flow: `masterVolume` (0 to 100) and `masterMuted` live in `AppSettings`; `useCoreSettings` rounds the volume, ORs in the `muted`
  startup flag, writes both into the ini's `[sound] volume/mute` and passes `volume: muted ? 0 : volume` to `startGame`.
- `useVolumeScaleMigration` rescales old 0 to 1 values; keep it.
- Live changes: the only `session.audio.setVolume` call in app code is the turbo path (`game/turbo/set-turbo-held.ts`, volume mirrored by
  `useHostFeatures`). Boot is guarded by `launch.id`, so a volume change does not restart the game. Verify by reading how Brock's `VOLUME`
  prop reaches the session that a mid-game slider or mute change calls `setVolume`; if not, add one effect in
  `views/GameSession/behavior/useHostFeatures.ts` calling `activeGameHolder.current?.session.audio.setVolume(muted ? 0 : volume)`.

## 5. Build list for one coder

Brief: no tests, lint, typecheck, build or app launch; edit, commit, return.

Files to change:

1. `apps/desktop/src/screens/game/gameplay/audio.settings.ts`: add keywords `'uploads'`, `'instant'`; make `masterVolume` use the RotP-style
   volume row (own-row key, no `control`); add section `sound` with `gateItem('instantUploads')`.
2. `apps/desktop/src/screens/game/extras/enhancements.settings.ts`: delete the `sound` section and the `'uploads'` keyword.
3. `apps/desktop/src/settings-controls/audio/VolumeRow.tsx` (+ `VolumeRow.css`, `audio.type.ts`, `audio-controls.constants.ts` mapping
   `masterVolume` to `masterMuted`), shaped like RotP's `settings-controls/audio/`, using Tessera `VolumeControl` (`step={5} showValue`,
   `muted`/`onMutedChange`). Master row only.
4. `apps/desktop/src/settings-controls/render-setting-control.tsx`, `own-row-keys.constants.ts` (currently an empty set) and `own-row-sections.ts`:
   register `masterVolume` as an own-row key, mirroring RotP's `own-row-sections.constants.ts`.
5. `apps/desktop/src/views/GameSession/behavior/useHostFeatures.ts`: only if the live volume path is missing (section 4).

Acceptance lines:

- Settings > Audio shows "Volume" (one row: Master Volume, slider 0 to 100 step 5, value shown, mute button, default 100, unmuted) and
  "Sound" (Instant Sound Uploads, default off, locked with the vanilla-safe overlay while `original` is on).
- Enhancements no longer shows a Sound section; searching "uploads" or "instant" finds the row under Audio.
- The Audio mute button and the title-bar mute/volume stay in sync (both write `masterMuted` / `masterVolume`).
- Changing volume or mute mid-game changes loudness without restarting; the ini still gets `[sound] volume=` and `mute=`.
- No row for the Music/SFX split, V-Sync, MSU-1 or the audio output device appears anywhere.
