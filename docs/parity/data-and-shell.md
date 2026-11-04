# Parity review: Data bucket and app shell (board I-24)

Read-only comparison of ChronoKi (`apps/desktop`) against RotP (`X:/relic-of-the-past/apps/desktop`),
both on brock-react 0.120. Sources: both apps' `screens/`, `views/`, `shell/`, `main.tsx`,
`main.constants.ts`, `brock.config.ts`, generated `.brock/*`, RotP `docs/getting-started/first-launch.md`,
`docs/user-guide/profiles.md`, RotP review shots in `.user-data/Data/review/review/` (02, 05, 14 to 17),
and ChronoKi's own scope table in `plans/chronoki-port.html` (Hookshop, Sanctuary, Studios, randomizer
and ALttP-only parts are out; updater is "later").

Nothing was launched; ChronoKi has no review screenshots, so its side is read from code.

---

## 1. App shell

### 1.1 Title bar

| | RotP | ChronoKi |
|---|---|---|
| Left buttons | menu, pin, search, **bug report**, **volume** (mute + slider menu) | menu, pin, search |
| Status items (`src/title-bar/*.action.ts`) | volume (1), **Save States** (2, only while the game runs), **FPS** status (3, when `showFps`), **refresh rate** (4) | none (`.brock/title-bar.ts` is empty) |
| Right | fullscreen, min, max, close | same (Brock) |

Gaps:
- No `VOLUME` (`volumeFromSettings`) passed to `BrockApp`, though ChronoKi already has `masterVolume` and
  `enableAudio` settings, so there is no volume button, no Mute/Volume rows in the menu.
- No `bugReport` prop, so no bug icon and no "Report a bug" menu row. RotP's is app-specific
  (`src/bug-report/rotp-bug-report`); ChronoKi needs a small one (log + profile + settings bundle).
- No Save States title-bar item although ChronoKi has the save state logic (`src/game/save-states/*`,
  quick slots in `GameSession`).
- No FPS / refresh-rate status items.

### 1.2 Main menu (hamburger)

RotP (shot 02): Home, Profiles, Settings, Data >, Hookshop | Widgets >, Advanced > | Save States (module
menu entry) | View >, Search, Report a bug, Check for updates, Mute, Volume | Credits, About | Quit.

ChronoKi, from config: Home, Profiles (Brock built-in screen), Settings, Data > | Widgets >, Advanced >
| View >, Search | Credits, About | Quit.

Gaps (game-neutral): Save States row (module `menu` entry), Report a bug, Mute/Volume. "Check for
updates" is the updater module, deferred by the plan. Hookshop is out of scope.

### 1.3 Shell module (`src/shell/`)

RotP's `rotpShellModule` = `{ Provider: GameSession, ports, logChannels, menu: ROTP_MENU }`.
ChronoKi's `chronokiShellModule` = `{ Provider: GameSession }` only.
Gaps: no `menu` (Save States), no `logChannels` (the built-in Logs widget has no game channels to filter),
no `ports`.

### 1.4 `BrockApp` props (`main.tsx`)

| Prop | RotP | ChronoKi | Note |
|---|---|---|---|
| `volume` | yes | **no** | see 1.1 |
| `developerTools` | `developerToolsFromSettings('developerToolsEnabled')` | no (bound by hand in `useHostFeatures` through a host gate) | works, but differs from RotP; check the Advanced menu shows Developer tools the same way |
| `dataDomains` | `ROTP_DATA_DOMAINS` | **no** | Storage page shows no folder list at all: Brock's `loadStorageSummary` filters by `dataDomainsState.domains`, which stays `[]` |
| `legalText` | yes (About footer) | **no** | ChronoKi's disclaimer sits in the Credits card instead |
| `profileHooks` | `rotpProfileHooks` (build `romFile`, `language`..., mkdir saves) | **no** | see 2.3 |
| `bugReport` | yes | no | see 1.1 |
| `restoreNavigation` | `false` | default | RotP reopens on the game, not the last menu screen |
| `showFlags`, `widgetDisabled` | yes | no | randomizer/online gating; not needed yet |

### 1.5 Widgets

RotP ships 10 app widgets (Cheats, Checks, Inventory, Navigation, Music Debugger, Game State, Live
Data Inspector, Simulator, Shadow Editor/Elements) plus Brock's built-in Logs and Performance.
ChronoKi: none of its own (`.brock/widgets.ts` empty); Brock's built-ins still appear.
Do not copy: Checks, Navigation, Shadow*, Simulator, Music (MSU), Cheats (ALttP codes).
Worth a CT equivalent later: a "Game State" debug widget (party, location, flags from WRAM), behind
developer tools. Low priority.

### 1.6 Search

Both use Brock's search fed by screen `keywords`. ChronoKi's index is small simply because it has few
screens. Small gaps: `storage.page.tsx` lacks the `backup` keyword RotP has; there is no Data Home or
Profiles/ROMs page to search for.

### 1.7 Play button (owner's point)

ChronoKi's base layer `views/GameView/GameView.tsx` draws a primary **Play** button (and the launch
notice) over the game canvas whenever `launch === null`, plus a `ModeBadge`. RotP's `GameView` draws no
controls: when the game is not running it shows only the background logo (`game-view__bg-logo`) and
the save state overlay; Play / Stop / Reset live on the Game **Home hero** (`HomeHeroContent`
`onStartGame`, `onStopGame`, `onResetGame`).
Shell-side fix: remove the Play button and notice from `GameView`, show an idle backdrop (ChronoKi
mark/logo) instead, and surface the launch notice on Home. The Home reviewer owns adding Play there.
The ModeBadge on the base layer has no RotP counterpart; keep it only if the owner wants it while playing.

### 1.8 First-run flow

RotP: no profile, so Escape and the Profiles menu entry land on `data/profiles` (via
`product.profilesRoute`), whose empty state says "No profiles yet. Import a ROM to get started"; the
create wizard picks ROM, language, music pack; ROMs page is one click away in the same sidebar.
ChronoKi: no `profilesRoute` (removed in I-20 because the page did not exist), so Brock's generic
Profiles card opens. It creates a profile with **no ROM and no mode** (no `profileHooks`), and ROM
import is in a different place (Data > Library). Launch then falls back to "first ready ROM"
(`resolveLaunch`). ChronoKi's own `profiles/storage/create-profile.ts` (`romFile`, `mode`) is never
called, and `AppState.firstRun` is unused.
Fix: build a `data/profiles` page (2.3), set `profilesRoute: 'data/profiles'` again, add
`profileHooks` that stores `romFile` (and `mode` if per-profile mode is kept).

### 1.9 `screens.config.ts` / `brock.config.ts`

| Item | RotP | ChronoKi |
|---|---|---|
| `settings: { bucket, page }` (target of the Settings menu row) | `{ bucket: 'game', page: 'picture' }` | missing; set it to ChronoKi's first settings page |
| Data bucket groups | `library`, `studios`; Storage at bucket root (shown under a "DATA" header) | `library` only, holding one "Library" page |
| `profilesRoute` | `'data/profiles'` | missing (see 1.8) |
| `dataDirs` | assets, roms, profiles, config + msu, languages, sprites, link-sprites | assets, roms, profiles, config, input: right for CT (no studios) |
| `copyright` | set | missing |
| `icons.wordmark` | set (title, hero art) | missing; add if ChronoKi gets a wordmark |
| `protocols`, `fileAssociations`, `schemes` | msul/rsp/rlang packs, sprite scheme | not needed (no studios) |
| `modules` | + updater, secrets, tools, catalog, mcp | display, port-kit, input; updater "later" per plan, the rest is store/online |

---

## 2. Data bucket

RotP sidebar (shots 14 to 17): Search Data, **Home** | DATA: **Storage** | LIBRARY: **Profiles**, **ROMs**,
Sprites | STUDIOS: Character, Language, MSU. Every page except Home uses `showHeader: true` and
`fill: true` with a `ListDetailLayout` (list left, detail right, collapsible).

ChronoKi sidebar: LIBRARY: **Library** (one page). Storage sits in the **Game** bucket
(`screens/game/storage.page.tsx`). No Home hero.

### 2.1 Data Home (`data/home.hero.tsx`)

RotP: compact hero, eyebrow "Data", title "Your library", **Open data folder** action (when
`capabilities.revealDataFolder`), **Refresh** tool, facts row (On disk, Profiles, ROMs), then a
"Sections" grid of cards per group (`DataSections`) and "Storage details" (`DataStorageDetails`).
ChronoKi: missing entirely.
Port: same hero; section cards for Profiles, ROMs, Storage only (drop Sprites and Studios); facts On
disk, Profiles, ROMs. `DataSections` / `DataStorageDetails` are RotP app compounds; copy them or ask
Brock to lift them.

### 2.2 ROMs (`data/library/roms.page.tsx`)

RotP: header, `ListDetailLayout`. Left: "Import ROMs" container (cartridge kind tabs Base / Second
cartridge, URL paste + Download, drop zone accepting .sfc/.smc/.zip/.7z/.rar, click to browse or paste,
"Extract sprites too"), then "Imported ROMs and supplements" list with delete. Right: ROM detail
(hash, region, extraction state, re-extract), empty "Select a ROM to view details".
ChronoKi `Library` view: a plain `Stack`: intro text, drop zone (.sfc/.smc only), status line, a
`ListItemRow` list (name, Ready / Assets not built, size). No selection, no detail, no delete
(though `storage/roms-store/delete-rom.ts` exists), no re-build of assets, no archive support, no
browse button besides the drop zone, no header.
Port: rename to "ROMs", `showHeader`, `fill`, `ListDetailLayout`; detail panel with SHA-1/region
verdict (port-kit), asset state and size, **Rebuild assets**, **Delete**. Archives (.zip/.7z) if
port-kit's ROM store takes them. Replace RotP's "Second cartridge" lane with CT's own optional lane:
**Steam data** for Steam margins (plan: "needs the player's Steam copy, as an optional import step";
the flag is derived from the stored Steam data, no setting). Drop "Extract sprites" and the URL download
(plan keeps it simple; URL import optional).

### 2.3 Profiles (`data/library/profiles.page.tsx`)

RotP: header, `ListDetailLayout`: profile list (double-click opens and goes to Game), Create button
opens a step wizard (Profile: name, ROM, language, MSU; Options; Randomizer; Review). Detail panel
with header (Open, Delete, folder button) and tabs: **Overview** (edit name/language/MSU, Details
facts), **Settings** (the profile's settings summary), **Data** (facts: Saves = manual, auto,
quick-slot use, battery save, size; Play = sessions/time; Controls), Randomizer (randomizer only).
ChronoKi: no page; Brock's generic Profiles card (name only).
Port: list + detail with Overview (name, ROM picker, mode Original/Enhanced if per-profile), Data tab
(battery save `sram.dat`, quick/normal/auto states, play time from `sessions-file.ts`, controls), a
short create wizard (name, ROM, mode, review). Drop language, MSU, randomizer, Archipelago, lobby.

### 2.4 Storage

RotP: `data/storage.page.tsx` = Brock `StoragePage` (`showHeader`, order 9, at bucket root) with
Overview (data folder path, size, Open folder) and Folders listing every data domain with size, item
count, description, Open folder, and Clear / Clean-older-than where allowed; plus export/import.
ChronoKi: same Brock page but placed in the Game bucket, no `showHeader`, and **no `dataDomains`**, so
the Folders list is empty.
Port: move to `screens/data/storage.page.tsx`, `showHeader: true`; add `CHRONOKI_DATA_DOMAINS`:
profiles (not clearable), roms (not clearable), assets (clearable, rebuilt on demand), input (input
profiles), config, and logs if the app writes a log folder.

### 2.5 Credits (`credits.card.tsx`)

RotP: `bare: true`, `size: 'info'`, renders `CreditsPage` from `@app/credits`: "Credits &
Attributions" intro, categories (Game & Core Engine, ...), each entry a card with author, linked
project, licence, role badge (CORE DEPENDENCY) and note.
ChronoKi: two paragraphs of `Text` in a `Stack`, not bare, legal disclaimer mixed in.
Port: a `CREDITS` data file and the same card list: BelthasarProject (MIT, core engine), LakeSnes
(MIT, inside it), ChronoType font (CC BY-NC-SA 3.0), Brock, Tessera, Emscripten, research sources
cited in `docs/port-research.md` (Compendium, Temporal Flux docs) as thanks. Move the Square Enix
disclaimer to `legalText` (About footer). Add `docs/legal/third-party-notices.md` (plan names it; it
does not exist yet).

### 2.6 Saves, save states, backups

RotP has no separate Data page for saves: lists, quick slots, auto-saves and SRAM import live on the
Game Home hero (Home reviewer), the save state slots overlay opens from the title bar / menu while
running, and per-profile save facts are on the Profiles detail Data tab. Backups are the Storage
page's export/import.
ChronoKi: save state logic exists (`game/save-states`, `game/auto-save`, `profiles/storage/
config-backup-file.ts`) with no UI at all: no slot overlay, no title-bar button, no menu row, no
facts. Shell part: `SaveStateOverlay`-like view on the base layer + title-bar item + module menu entry.

### 2.7 Not to copy

Sprites page (ALttP HUD/menu sprites), Character / Language / MSU studios, Hookshop bucket,
Randomizer bucket and wizard steps, Archipelago/Archipelia fields, lobby status, `.msul/.rsp/.rlang`
file associations and `app-sprite` scheme, `showFlags` online gating.

---

## 3. Work items, most important first

1. Move Storage to the Data bucket (`screens/data/storage.page.tsx`, `showHeader`) and pass `dataDomains` (profiles, roms, assets, input, config, logs).
2. Build the ROMs page as `ListDetailLayout` (rename Library; list with select + delete; detail with verdict, asset state, Rebuild assets).
3. Build `data/profiles` page (list + detail tabs Overview/Data, short create wizard with ROM + mode); add `profileHooks` storing `romFile`; set `profilesRoute: 'data/profiles'`.
4. Remove Play button and notice from `GameView`; show an idle logo backdrop (Play itself goes to Home).
5. Save States UI: slot overlay on the base layer, title-bar item while running, shell module `menu` entry.
6. Pass `volume` (`volumeFromSettings` on `masterVolume`; add a `masterMuted` setting) for the title-bar volume button and menu Mute/Volume.
7. Data Home hero (Your library, Open data folder, Refresh, facts, section cards, storage details).
8. Credits: `CREDITS` data + card list like RotP; move disclaimer to `legalText`; write `docs/legal/third-party-notices.md`.
9. `screens.config.ts`: add `settings: { bucket: 'game', page: ... }`; Data groups to match the new pages.
10. Bug report: a `bugReport` bundle so the title-bar bug button and menu row appear.
11. FPS / refresh-rate title-bar status items (needs a `showFps` setting).
12. Shell module `logChannels`; `restoreNavigation={false}`; `developerTools` via `developerToolsFromSettings` like RotP.
13. Optional Steam-data import lane on the ROMs page (the flag is derived from `steam/steam-data.json`; no setting).
14. Later: CT "Game State" debug widget; updater module per plan.
