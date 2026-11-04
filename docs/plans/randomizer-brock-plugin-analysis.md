# Randomizer support as shared Brock code: what moves, what stays

Board item I-73. Phase one of the approved randomizer plan (`plans/randomizer-plan.html`): split randomizer
support into a part Brock owns and RotP and ChronoKi (and later games) share, and a part each game keeps.
Sources read: RotP `packages/randomizer`, `apps/desktop/src/{game/randomizer-client,game/archipelia,screens/randomizer,views/Randomizer,views/ChecksWidget,widgets,settings-controls/lock-cause-of.ts,profiles}`,
`integrations/archipelago`, `tooling/apworld`; Brock `docs/architecture.md`, `docs/app-structure.md`,
`packages/core/src/{module,settings/features,storage/profiles,augment.ts}`, `packages/react/src/modules/renderer-module.type.ts`,
`packages/modules/port-kit`; the Brock board decisions D-28 (I-147, MSU) and D-29 (I-148, game info) and the MSU
module draft (`defineMsuGame` plus `MsuHost`); ChronoKi `packages/features`, `packages/game-core/src/game-info`,
`apps/desktop/src/profiles`.

**Word used.** In Brock a *plugin* is a CLI plugin (`definePlugin`, e.g. `brock-plugin-snes`). Code that runs in the
app is a *module* (`package.json#brock`, `brock add <id>`). D-28 and D-29 put MSU and game info in modules for that
reason, so the owner's "randomizer plugin" is a set of Brock **modules** here. Only the apworld build tool is CLI-side.

**Pattern followed** (the MSU and game-info modules): the module owns the format, the logic, the UI shell and the
lifecycle; the game passes one config made with `define<X>Game(config)` and implements a small host interface.
Nothing ALttP or Chrono Trigger lives in Brock.

## 1. Inventory

Class: **B** Brock module (generic) · **A** adapter (the module defines the interface, the game implements it) ·
**G** game-specific (stays in RotP or ChronoKi). "CK" is the ChronoKi plan phase or batch.

### Generator (seed, world model, fill)

| Part | RotP today | CK counterpart | Class | Why (borderline only) |
|---|---|---|---|---|
| RNG, seed hashing | `src/rng/` | P2-b | B | |
| Rule nodes: tree, combinators, eval, walk, build | `world/rules/{rule-node.type,combinators,rule-eval,rule-node-walk,rule-node-build}` | P2-a rules | B | The node ops are generic. RotP's closed unions (`HelperName`, `RuleOptionKey`) become type parameters. |
| Rule helpers (`hasSword`, `canLiftRocks`...) | `world/rules/{helper-rules,helpers-registry,derived-nodes,*-helpers.constants}` | CT helpers | A | A helper registry the game fills; the node `helper` op calls it. |
| Collection state, region reachability | `world/collection-state`, `compute-/update-reachable-regions.ts` | P2-b | B | |
| World shapes: region, exit, location, event, item class | `world/region.type.ts`, `world.type.ts` | P2-a | B | Generic core plus a `tags` bag. ALttP fields (`isLightWorld`, `kdsOnly`, `pondSlot`, `capacityOnly`, dungeons) move into RotP's tags or its own extension type. |
| World content: regions, locations, items, events, story gates, dungeon items, shops, pond, capacity, progressive, retro, dark rooms, final fight | `world/*` (the rest) | P2-a, P7 modes | G | |
| Item pool | `world/pool` | P2-a | A | `buildPool(snapshot)` returns items, pre-placed and starting items. |
| Restrictive fill, assumed state, swap, sweep, verify, stats | `world/fill/{fill-restrictive,attempt-placement,can-fill-location,create-assumed-state,try-swap,sweep-placed-items,verify-placement,placement-stats}` | P2-b | B | Derived from Archipelago (MIT); the NOTICE moves with it. |
| Game fill phases: dungeon fill, prizes, pond, prices | `world/fill/{dungeon-fill,place-prizes,roll-placement-prices,pond-*}` | none in v1 | A | Ordered `FillPhase[]` the game supplies; the generic fill runs between them. |
| Generate orchestrator | `src/generate.ts` | P2-d | B | Over a `GameWorldDef`. |
| Spoiler with spheres | inside generate, `SpoilerPanel` | P2-d, P4-d | B | |
| Normal (vanilla) placement | `normal-placement/` | P2-d | A | Brock builds it; the game supplies the recorded vanilla contents. |
| Option catalog content and descriptions | `world/options*`, `options-descriptions.constants.ts` | P2-c (JoT-named) | G | Content only; the shape is B. |
| Option catalog shape, snapshot build/normalize, schema stamp | `options-snapshot/` | P2-c | B | Rule kept: rows added later read as baseline, another stamp is a clean break. |
| Placement IO with schema stamp | `placement-io/` | P3-e | B | The game passes its current and legacy stamps so RotP's `placement-v6` files still load. |
| Placement and tracker availability | `placement-availability/`, `client/tracker-availability/` | P4-a | B | |
| ROM audit tools | `src/audit/` | none | G | ALttP ROM census, a dev tool. |
| ALttP mechanics (capacity, ponds, wish pond, gate word, prize shuffle, progressive tiers, dungeon grants, keyed-record, checked-access) | `src/{capacity-*,pond-*,wish-pond-plan,gate-word-5,prize-shuffle,progressive-tiers,dungeon-item-grants,keyed-record,checked-access}` | none | G | `keyed-record` and `checked-access` look like utilities; promote them only if the lift needs them. |

### Hooks into the running game

| Part | RotP today | CK counterpart | Class | Why |
|---|---|---|---|---|
| Memory read bridge | Wasm flag exports, `client/poll-heap-reads` | `CkWramPtr` (exists, game-info), typed reads P1-a | A | `MemoryBridge` interface; Brock ships a default over port-kit's `CoreCalls.heap()` plus a pointer export. |
| Memory write (bounded) | through its C core | `CkRamWrite`, P5-e | A | Optional `write` on the bridge, called only by delivery. |
| Check detection | `client/check-detection` (`room-mask`, `ow-mask`, `progress`) | P1-b dataset, event and chest bits | B + G | Brock owns a `FlagProbe` evaluator (region, offset, mask, compare). The check-to-probe table is G. RotP's room and overworld masks become probes through its adapter. |
| Push-reported checks (override fire) | `client/override-fire-registry`, `fire-reported-classes` | none (no seam in CK) | G | Brock exposes `reportCheck(key)` so a seam can push instead of being polled. |
| Location poller: start, stop, pause, poll once, baseline, rebaseline, suppress | `apps/.../randomizer-client/location-poller`, `client/location-poller`, `poll-rebaseline` | P1, P3-b | B | Rebaseline is driven by port-kit's save `onLoaded`. |
| Seed application | C override tables (`drop/npc/scripted/shop/standing-overrides`, `apply-overrides`, receipt grants and text) | pack overlay, P3-a | A | `SeedApplier`, whole or nothing. RotP arms hooks; ChronoKi patches a pack copy at load. Neither shape is generic. |
| Delivery queue: order, idempotence, received cursor | `delivery-queue/`, `client/received-*`, `received-batch-order` | P5-d | B | |
| Delivery execution and safe frame | `delivery-execute/`, `delivery-api/` | P5-e (field mode, no menu or battle, time-gate guard) | A | `ItemDeliverer` with `isSafeFrame()`; Brock schedules on the frame boundary. |
| AP state in the save (received index, room hash) | `ap-received-index/`, `ap-room-hash/` (SRAM) | Engine risk 8 (WRAM byte or ledger) | A | `ApStateStore`; RotP SRAM, ChronoKi ledger. |
| Core feature bits | `kFeatures3_ReceiptExport`, `kFeatures5_ApOnline` | feature rows P1-d | G | Brock exports suggested feature ids; each app's registry owns its rows. |

### Session, Archipelago, lobby

| Part | RotP today | CK counterpart | Class | Why |
|---|---|---|---|---|
| Local session: start, stop, store, run kind, armed log | `randomizer-client/{local-session,session-start,session-stop,session-store,run-kind,local-armed-log}` | P3-b | B | |
| Online client: handshake, room, data package cache, dispatch, reconnect, client status, names, players, network monitor | `client/online-*`, `reconnect`, `data-package-cache`, `network-*` | P5-c, P5-d | B | Already on `archipelia-client-kit`. |
| Scouts to placement, arm scouted | `client/scouts-to-placement`, `online-arm-scouted` | P5-c | B | Arms through the game's `SeedApplier`. |
| Foreign items | `foreign-icons/`, `foreign-items/`, `client/foreign-icon-*` | renamed placeholder item, P5 | B + G | Brock maps the other game to an icon class; drawing it in game is G. |
| DeathLink / kill link | `client/{death-link*,ap-kill-link*,ap-link-died}` | P5 (send only) | B + A | Protocol B; `onPartyWipe` and `kill()` A, receive gated by default. |
| AP export, id universe, slot data, player YAML, pre-rolled world | `archipelago/{export,ap-*,slot-data*,player-yaml,player-file,pre-rolled}` | P5-b | B | The id table content (append-only, keep test) is G. |
| apworld Python loader | `integrations/archipelago/relic_of_the_past/{__init__,data,model,regions,locations,items,options,rules}.py` | P5-a | B | A generic JSON-world loader template. `primitives.py` and `dungeon_fill.py` are G. Run only by the Archipelago host. |
| apworld build and pack | `tooling/apworld/*` | P5-a | B | A build tool in the archipelago module (bin), not app code. |
| Archipelia lobby: browse, builds, join, membership, socket, watch | `apps/.../game/archipelia/*` | P6 | B | |
| Cheats (mark a check, grant) | `cheat-check-*`, `cheats/` | later | B + A | Mark is B; the grant is the `ItemDeliverer`. |

### Profiles, settings, screens, tracker

| Part | RotP today | CK counterpart | Class | Why |
|---|---|---|---|---|
| Profile modes V, VS, R, RO, AL and the badge | `ProfileRandomizerConfig.mode`, `compounds/ModeBadge` | P3, `ProfileModeId` | B | Brock has no mode concept yet: a new extension point (section 2). V and VS stay app-defined; R comes from the randomizer module, RO and AL from the archipelago module. Badge art is Tessera-themed per app. |
| Wizard steps Profile, Randomizer, Options, Connection, Review | `ProfileCreateWizard/sub-components/*` | P3-c, P5-f | B | Profile step stays the app's; the others are module steps in a new Brock wizard slot. |
| Randomizer profile fields | `ProfileRandomizerConfig` | P3-e | B | `ProfileExtension` augment by the modules. `frozenSettings` becomes `Record<string, unknown>`. |
| Lock cause `randomizer` (frozen keys) | `settings-controls/lock-cause-of.ts` | P3-e | B | A lock-cause provider. `host`, `developer`, `vanillaSafe` stay the app's; Brock composes providers in a fixed order. |
| Randomizer pages Run, Options, Logs, Spoiler, Network, Online | `screens/randomizer/*`, `views/Randomizer/*` | P3-d, P5-f | B | Shells and generic tabs are B. Options sections (StoryGates, DarkRooms, Pond, Capacity in RotP; key items, characters, bosses in CK) are G render slots. |
| Checks widget: groups, filters, search, list/compact/grid | `widgets/checks.widget.tsx`, `views/ChecksWidget` | P1-c, P4-b | B | Grouping ids (dungeon, era, location, type) are G data. |
| Inventory widget | `widgets/inventory.widget.tsx` | P1-c | G | Overlaps the game-info module's inventory section (I-148). Leave it to game info; the tracker does not duplicate it. |
| Key Items widget | none | P4-c | B + G | A grid shell with a go-mode light is B; per-mode layouts are G. |
| Navigation, Debug widgets | `navigation.widget.tsx`, `debug.widget.tsx` | dropped, game-info | G | |
| Logs | log bus | P1 | Brock (exists) | The modules add `randomizer` and `archipelago` log channels. |
| `tracker.json` (marks, layout, notes) | `profiles/storage` tracker file | P4-d | B | |
| Icons from the player's ROM or pack | ROM sprites | pack icons, placeholders | A | `icon(ref)` on the tracker provider; nothing ships. |

## 2. The proposed modules

**Three modules plus one small Brock core addition.** They are separate so an app can take the tracker alone
(allowed in Vanilla Safe), or the randomizer without Archipelago, and so the client-kit and Python template only reach
apps that play online.

| Package | `brock.id` | Holds | Depends on |
|---|---|---|---|
| `@drizztdourden08/brock-randomizer` | `randomizer` | `./world` (pure TS, no React): world shapes, rule nodes, state, reachability, fill, sweep, RNG, options snapshot, generate, spoiler, normal placement, placement IO, availability. `./session`: session, poller, `FlagProbe`, delivery queue, safe-frame scheduler. `./renderer`: pages, R mode, wizard steps, lock cause, boot task. | brock-core, brock-react, port-kit (types only) |
| `@drizztdourden08/brock-tracker` | `tracker` | Checks widget, Key Items grid widget, a `tracker` widget kit, `tracker.json`, availability view (vanilla placement on normal profiles). | brock-randomizer `./world` |
| `@drizztdourden08/brock-archipelago` | `archipelago` | Online client on `archipelia-client-kit`, export, id helpers and keep-test helper, player YAML, DeathLink, foreign items, Network and Online pages, Connection step, RO and AL modes, Archipelia lobby, the apworld JSON-loader template and `build-apworld` bin. | brock-randomizer, archipelia-client-kit, archipelia-lobby-protocol, jszip |
| brock-core / brock-react addition | n/a | `RendererModule.profileModes`, `RendererModule.profileWizardSteps`, `RendererModule.lockCauses` (ordered providers composed into `settings.lockCauseOf`), and a way to compose several `ProfileStoreHooks`. | |

### Public API sketch

```ts
// brock-randomizer/world
type RuleNode<H extends string = string, O extends string = string> =
  | { op: 'true' } | { op: 'false' }
  | { op: 'has'; item: string; count?: number } | { op: 'hasAny'; items: readonly string[] }
  | { op: 'countGroup'; items: readonly string[]; atLeast: number | { option: O } }
  | { op: 'all' | 'any'; of: readonly RuleNode<H, O>[] }
  | { op: 'if'; cond: RuleNode<H, O>; then: RuleNode<H, O>; else: RuleNode<H, O> }
  | { op: 'region'; region: string } | { op: 'location'; location: string }
  | { op: 'option'; key: O; equals: string | number | boolean }
  | { op: 'helper'; name: H; args?: readonly (string | number | boolean)[] };

interface ItemDef { key: string; label: string; class: 'progression' | 'useful' | 'filler' | 'trap'; groups?: string[] }
interface LocationDef { key: string; region: string; kind: string; vanillaItem?: string; rule?: RuleNode; tags?: Record<string, unknown> }
interface RegionDef { id: string; label: string; exits: { to: string; rule?: RuleNode }[]; tags?: Record<string, unknown> }
interface EventDef { key: string; region: string; rule?: RuleNode; grants: string }   // bosses, story beats -> tokens

interface GameWorldDef<H extends string, O extends string> {
  game: string;                      // stable id; also the default AP game name
  worldSchema: string;               // bumps when the world changes shape
  items: readonly ItemDef[]; locations: readonly LocationDef[]; regions: readonly RegionDef[]; events?: readonly EventDef[];
  start: string; goal: RuleNode<H, O>;
  helpers: Record<H, (state: CollectionState, args: readonly unknown[]) => boolean>;
  options: OptionCatalog<O>;
  buildPool(snapshot: OptionsSnapshot<O>): PoolPlan;
  fillPhases?: readonly FillPhase[];   // run in order around the generic restrictive fill
  verify?(placement: Placement): readonly string[];   // refusals, named
  vanillaContents?(): Placement;       // for the normal placement
}

interface OptionDef<O extends string> {
  key: O; label: string; description: string; section: string;
  kind: 'toggle' | 'choice' | 'range' | 'text'; baseline: unknown;
  choices?: readonly { value: string; label: string }[]; range?: { min: number; max: number };
  apName?: string;                                        // the player YAML key
  freezes?: (value: unknown) => Record<string, unknown>;  // app settings frozen while this row is set
}
interface OptionCatalog<O extends string> { schema: string; legacySchemas?: string[]; rows: readonly OptionDef<O>[]; presets: readonly OptionPreset<O>[] }

const generate: (world: GameWorldDef<any, any>, seedText: string, snapshot: OptionsSnapshot) => { placement: Placement; spoiler: Spoiler };

// brock-randomizer/session
interface MemoryBridge {
  read(region: string, offset: number, length: number): Uint8Array | null;  // null: no game running
  write?(region: string, offset: number, bytes: Uint8Array): boolean;        // bounded; delivery only
  isLive(): boolean;                           // a game is running and the read is meaningful (CT time-gate guard)
  onStateLoaded(cb: () => void): () => void;   // rebaseline
  onFrameBoundary(cb: () => void): () => void; // the only time writes happen
}
const portKitMemoryBridge: (core: CoreCalls, opts: { regions: Record<string, { pointerExport: string; size: number }>; isLive?: (m: MemoryBridge) => boolean }) => MemoryBridge;

type FlagProbe =
  | { region: string; offset: number; mask?: number; compare?: 'set' | 'eq' | 'gte' | 'anyOf'; value?: number | readonly number[] }
  | { custom: (memory: MemoryBridge) => boolean };

interface SeedApplier {
  apply(placement: Placement, ctx: ApplyContext): Promise<{ ok: true; edits: number } | { ok: false; refusal: string }>;  // whole or nothing
  revert(): Promise<void>;
}
interface ItemDeliverer {
  isSafeFrame(memory: MemoryBridge): boolean;
  deliver(item: string | ForeignItem, from: Sender): 'done' | 'retry' | 'refused';
  announce: 'in-game' | 'toast';
}
interface ApStateStore { read(): Promise<{ receivedIndex: number; roomHash: number } | null>; write(state: { receivedIndex: number; roomHash: number }): Promise<void> }

// brock-tracker
interface TrackerProvider {
  checks: readonly { key: string; label: string; kind: string; groups: Record<string, string> }[];
  groupings: readonly { id: string; label: string }[];          // dungeon | era | location | type
  keyItemLayouts?: readonly KeyItemLayout[];                    // per mode; tiles lit from inventory, party, flags
  icon?(ref: string): Promise<ImageBitmap | null>;              // drawn from the player's own data
}
interface KeyItemLayout { id: string; label: string; sections: readonly { label: string; tiles: readonly { id: string; label: string; icon: string; lit: FlagProbe | { item: string } }[] }[]; goMode?: RuleNode }

// the one call a game makes
const defineRandomizerGame: (def: {
  world: GameWorldDef<any, any>; checks: Record<string, FlagProbe>; reportable?(key: string): boolean;
  memory: MemoryBridge; applier: SeedApplier; deliverer?: ItemDeliverer; apState?: ApStateStore;
  tracker?: TrackerProvider; optionSections?: Record<string, ComponentType>;   // game-drawn Options sections
  archipelago?: { gameName: string; apIdBase: number; ids: ApIdTable; loaderExtras: string };  // extras: e.g. primitives.py
  settingKeys: readonly string[];      // app settings the snapshot may freeze
}) => RandomizerGame;
```

### What the modules register with Brock

| Registers | randomizer | tracker | archipelago |
|---|---|---|---|
| Profile modes (new slot) | `randomizer` (R) | none | `randomizer-online` (RO), `randomizer-archipelia` (AL) |
| Wizard steps (new slot) | Randomizer, Options, Review | none | Connection (RO, AL); Archipelia seat fields |
| Lock cause (new slot) | `randomizer`: keys in `profile.randomizer.frozenSettings` | none | none |
| Screens | bucket `randomizer`: Run, Options, Logs, Spoiler; an entry hook other modules add pages through | none | Network, Online pages through that hook (a module cannot redeclare the bucket) |
| Widgets | none | `checks`, `key-items`, kit `tracker` | none |
| Settings tab | none | tracker display (spoilers, show blocked) | online notices |
| Boot tasks | renderer: register the game, load `randomizer.json` for the active profile | renderer: load `tracker.json` | renderer: data package cache |
| Log channels | `randomizer` | none | `archipelago` |
| `beforeQuit` | stop session, flush log | flush marks | disconnect, flush pending checks |
| Feature ids (suggested; the app owns its rows) | `randomizer`, `itemDelivery` | `trackerWidgets` | `archipelagoOnline`, `deathLinkReceive` |
| `ProfileExtension` augment | `randomizer: { mode, seed, options, frozenSettings, origin? }` | none | `serverUrl, slotName, password, deathLink, trackOtherPlayers` |

### How a game wires it in

1. `brock add randomizer tracker archipelago` (lists the ids in `brock.config.ts`, runs sync).
2. One file, e.g. `src/randomizer/<game>-randomizer.ts`, calls `defineRandomizerGame({...})`; a renderer boot task
   `src/boot/randomizer.task.ts` registers it. Until it is registered the modules contribute nothing visible.
3. Plain options in `product.moduleOptions.randomizer` (`{ modes: ['local','online','archipelia'] }`), so the build reads
   them without loading the app.
4. The app adds the suggested feature rows to its own registry (with its own `affectsVanillaParity`), and the lock
   providers sit in the app's order: host, developer, randomizer, vanillaSafe.

## 3. Management

**Lifecycle.**

| Moment | What happens | Owner |
|---|---|---|
| Enable | Module listed in `brock.config.ts`, game registered at boot. Per profile: the mode chosen in the wizard; V and VS profiles never arm anything, and the pack or core gets the shipped bytes. | app + module |
| Seed time | Wizard values -> `buildOptionsSnapshot` -> `generate` -> `randomizer.json` written -> `frozenSettings` from each row's `freezes` stored on the profile -> the lock cause locks those keys. A seed belongs to its profile; a new seed is a new profile (RotP's rule). | randomizer |
| Session start | On core start for an R/RO/AL profile: read the placement, check its stamp, `applier.apply` (a refusal stops the start with the named location), start the poller (adopt existing completions one frame later), compute availability. Online: connect, scout, arm the scouted placement through the same applier. | randomizer, archipelago |
| Play | Poller reports each check once (log, tracker, `LocationChecks`); deliveries wait for `isSafeFrame` at a frame boundary. | randomizer |
| Save-state load | port-kit `onLoaded` -> `memory.onStateLoaded` -> poller rebaseline (adopt loaded completions a frame later, re-arm undone checks), `apState.read()` again. | randomizer |
| Session stop | Core stop, profile switch or quit: poller stop, log flush, `applier.revert`, disconnect. | randomizer, archipelago |

**Files in userData, per profile** (the same names RotP uses, so a RotP profile folder reads unchanged):

| File | Written by | Content and rule |
|---|---|---|
| `profiles/<id>/profile.json` | Brock profile store | the `randomizer` field (augment) |
| `profiles/<id>/randomizer.json` | brock-randomizer | placement and spoiler keys, stamp `{ game, worldSchema, placementSchema }`. A stamp the game does not list as current or legacy reads as absent, as in RotP. Keys only, never ROM bytes. |
| `profiles/<id>/tracker.json` | brock-tracker | manual marks, layout choice, notes |
| `profiles/<id>/sessions.json` | brock-archipelago | room sessions |
| `profiles/<id>/archipelago/` | brock-archipelago | exported player YAML and apworld copy |
| game-own files | the game | e.g. ChronoKi's `randomizer-ledger.json` behind its `ApStateStore` |

**Versioning.** The three modules version in lockstep with Brock (0.120.x today) and publish with it. The world,
options and placement schemas belong to each game (`worldSchema`, `OptionCatalog.schema`), so a Brock release never
invalidates a stored seed by itself; the module's own `placementSchema` changes only with a Brock migration
(`ModuleMigration`) that rewrites old files or lists them as legacy.

**Parity rules** (as for MSU-L, I-147 acceptance 3: "RotP moves with no loss"):

- Every lifted slice ships with RotP **golden seeds**: a fixed set of (seed text, options) pairs whose placement and
  spoiler JSON must be byte-identical before and after RotP switches to the module.
- RotP's existing `placement-v6` and `ap-options-v2` files load unchanged (passed as RotP's current stamps).
- RotP's AP ids, apworld output and player YAML stay byte-identical (keep test plus a hash of the built `.apworld`).
- RotP's tests move with the code they cover; RotP keeps only adapter tests.
- No slice is deleted from RotP until RotP runs on the module at parity in a local release.

## 4. Migration order

**Brock first**, each slice landing before the next starts; each one is adopted by RotP before ChronoKi uses it.

| Step | Brock builds | RotP adopts (at parity) | ChronoKi |
|---|---|---|---|
| B0 | core/react slots: `profileModes`, `profileWizardSteps`, `lockCauses`, composed `ProfileStoreHooks` | moves V/VS modes and its lock order onto the slots, no visible change | moves `ProfileModeId` to the slots with the Vanilla Safe work |
| B1 | `brock-randomizer/world` lifted from RotP with generics, NOTICE kept | swaps imports; golden seeds identical; ALttP extras become tags, fill phases and helpers | P2 writes only the CT world on it |
| B2 | `brock-randomizer/session` + renderer: poller, `FlagProbe`, session, delivery queue, safe frame, pages, R mode, wizard steps, lock cause | RotP's adapter: its probes, override-hook `SeedApplier`, receipt `ItemDeliverer`, SRAM `ApStateStore` | P3 writes the overlay applier and CT option sections |
| B3 | `brock-tracker` (after game info, I-148, so the two share the poller and do not overlap) | Checks widget onto it; Inventory stays with game info | P1 and P4 widgets come from it |
| B4 | `brock-archipelago`: client, export, apworld template and bin, lobby, RO/AL modes, pages, Connection step | onto it; apworld hash identical | P5 and P6 |

**ChronoKi phases, changed by the split.**

| Phase | Before | After |
|---|---|---|
| P0 spike (overlay, memory) | as planned | unchanged; game-specific, starts now (`CkWramPtr` already exists from game info) |
| P1 memory bridge, vanilla tracker | typed reads, check dataset, 4 widgets | shrinks: the `MemoryBridge` adapter (over port-kit), the check dataset as `FlagProbe` rows (P1-b), Inventory and Debug through game info. Checks widget waits for B3; until then the game-info widget covers the live view. |
| P2 world and generator | world plus lifted fill, sweep, RNG, snapshot, spoiler | shrinks to the CT `GameWorldDef`: regions, locations, items, events, helpers, JoT-named option catalog, goal, pool. P2-b and most of P2-c and P2-d disappear. |
| P3 local end to end | overlay, session, poller, modes, wizard, pages, IO, lock cause | shrinks to the overlay `SeedApplier` (P3-a), the `load-assets.ts` hook, CT option sections. P3-b to P3-e come from B0 and B2. |
| P4 tracker parity | availability, views, Key Items, spoiler, tracker.json | shrinks to the Key Items layouts per mode (P4-c data) and grouping ids. |
| P5 Archipelago | everything online | shrinks to the CT id table, `primitives.py` extras, the WRAM `ItemDeliverer` with its safe-frame rule, the `ApStateStore` design (still Opus: Engine risk 8), DeathLink party-wipe read. |
| P6 Archipelia lobby | 2 batches | config only (the AL mode is in B4). |
| P7 more modes, JoT import | as planned | unchanged; game-specific (new fill phases and script tools live in ChronoKi). |

## 5. Risks and open questions

| # | Question or risk | Recommended default |
|---|---|---|
| 1 | Three modules or one module with subpath exports (the MSU draft uses one module, subpaths `./packs`, `./player`, `./session`). | Three modules: the tracker must run alone in Vanilla Safe and online deps should not reach offline-only apps. Shared types stay in `brock-randomizer/world`. |
| 2 | Profile modes, wizard steps and lock causes are not Brock concepts today; the randomizer module could own the wizard instead. | Add the three generic slots to brock-react (B0); the wizard frame stays each app's, modules only contribute steps. Other future modules (a race mode, a co-op mode) reuse them. |
| 3 | RotP's fill is ALttP-shaped (dungeon fill, prizes, ponds, prices interleave with the restrictive fill); a generic fill could change RotP's seeds. | Fill as ordered phases with RotP's phases as the first client; golden seeds byte-identical is a merge gate for B1, not a follow-up. |
| 4 | ChronoKi waiting on Brock delays the owner's randomizer. | ChronoKi does not wait: P0 and the P1 check dataset start now (game-specific). P2 waits for B1 rather than writing a second fill; if B1 slips past P0 and P1, P2 starts on the CT world types, which are the same shapes. |
| 5 | Licence and Python: the fill derives from Archipelago (MIT) and Brock packages are UNLICENSED on a private registry; the apworld template is Python inside a TS module. | NOTICE.md moves into brock-randomizer with the Archipelago attribution; the Python template ships as data in brock-archipelago and is only zipped into the `.apworld`, never run by the app. |

## 6. Brock dependency request (ready to paste)

**Title:** Shared randomizer modules: core, tracker, Archipelago (RotP + ChronoKi)

**Description:** Owner asked: lift RotP's randomizer into Brock modules shared with ChronoKi: brock-randomizer (world,
rules, fill, sweep, RNG, snapshot, spoiler, session, poller, delivery), brock-tracker (widgets),
brock-archipelago (client, export, apworld, lobby), plus core slots for profile modes, wizard steps,
lock causes. Plan: chronoki docs/plans/randomizer-brock-plugin-analysis.md.

**Acceptance:**

1. games wire in via defineRandomizerGame (world, FlagProbe checks, MemoryBridge, SeedApplier); no ALttP or CT inside
2. RotP moves with no loss: golden seeds, placement-v6 files, AP ids and the built apworld stay byte-identical
3. brock-react gains profileModes, profileWizardSteps and ordered lockCauses slots on RendererModule
4. tracker runs alone on a vanilla profile; poller rebaselines on a save-state load and reports each check once
5. writes to game memory happen only at a frame boundary the game's isSafeFrame accepts
