# Third-party notices

ChronoKi is an unofficial fan project. It contains no Square Enix game data, ROM or asset; the
player supplies their own ROM and the app builds its working data locally. Chrono Trigger is a
trademark of Square Enix. This file credits the third-party pieces ChronoKi ships or imports; the
in-app Credits screen lists the same pieces.

| Piece | Author | Licence | How it is used |
|---|---|---|---|
| BelthasarProject (tag `v0.13.0-preview`, commit `0c7b3c33`, see `core/belthasar.pin.json`) | TemplarServant | MIT | Game core, compiled to WebAssembly |
| LakeSnes | elzo-d | MIT | SNES emulator core embedded in BelthasarProject |
| Brock (`@drizztdourden08/brock-*`) | Drizztdourden | MIT | App framework |
| Tessera (`@drizztdourden08/tessera`) | Drizztdourden | MIT | Design system |
| ChronoType (extended) | see its `readme.txt` | CC BY-NC-SA 3.0 | UI typeface. Credit given, non-commercial use, shared under the same licence. Its `license.txt` and `readme.txt` ship in `fonts/chronotype/` |
| Electron | Electron contributors | MIT | Desktop shell |
| Emscripten | Emscripten contributors | MIT | Build-time toolchain for the WebAssembly core |
| Capacitor and plugins | Ionic and contributors | MIT | Mobile shell |
| Velopack | Velopack contributors | MIT | Installer and updates |
| koffi | Niels Martignene | MIT | Native bindings |
| React, React DOM | Meta and contributors | MIT | UI rendering |
| zustand | Poimandres and contributors | MIT | State store |

Research read for understanding only, no code or data taken: ChronoRET (ThisIsAkill, MIT),
ct_disassembly (dscotton, CC0), the Chrono Compendium and Temporal Flux community documentation.
See `docs/port-research.md`.

The full licence text of each piece is in its own package or repository. The exact versions are in
`pnpm-lock.yaml`.
