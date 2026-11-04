/* @layer shared-other @kind data */
import type { CreditCategory, UsageLevel } from './credits.type';

const USAGE_LABELS: Record<UsageLevel, string> = {
  'original-work': 'Original Work',
  'core-dependency': 'Core Dependency',
  'data-direct': 'Data Used Directly',
  'assets-direct': 'Assets Used Directly',
  'assets-modified': 'Assets Modified',
  'logic-port': 'Logic Ported',
  'logic-reference': 'Logic Reference',
  'reference': 'Reference',
  'inspiration': 'Inspiration',
};

const CREDITS: CreditCategory[] = [
  {
    id: 'game',
    title: 'Game & Core Engine',
    entries: [
      {
        name: 'TemplarServant',
        project: 'BelthasarProject',
        description: 'A native C reimplementation of Chrono Trigger, checked frame by frame against an emulator core.',
        usage: 'core-dependency',
        usageNote: 'Pinned release (see core/belthasar.pin.json), compiled to WebAssembly; the game engine itself. It reads only data built from your own ROM.',
        url: 'https://github.com/TemplarServant/BelthasarProject',
        license: 'MIT',
      },
      {
        name: 'elzo-d',
        project: 'LakeSnes',
        description: 'SNES emulator core embedded in BelthasarProject.',
        usage: 'core-dependency',
        usageNote: 'Comes inside the Belthasar core.',
        url: 'https://github.com/elzo-d/LakeSnes',
        license: 'MIT',
      },
    ],
  },
  {
    id: 'platform',
    title: 'App Platform',
    entries: [
      {
        name: 'Drizztdourden',
        project: 'Brock',
        description: 'The app framework: build, launch, screens, settings and profiles.',
        usage: 'core-dependency',
        usageNote: 'ChronoKi is a Brock app.',
        license: 'MIT',
      },
      {
        name: 'Drizztdourden',
        project: 'Tessera',
        description: 'The design system every screen is drawn with.',
        usage: 'core-dependency',
        usageNote: 'Primitives, composites and tokens.',
        license: 'MIT',
      },
      {
        name: 'Electron contributors',
        project: 'Electron',
        description: 'Desktop shell around the web renderer.',
        usage: 'core-dependency',
        usageNote: 'Runs the desktop build.',
        url: 'https://www.electronjs.org',
        license: 'MIT',
      },
      {
        name: 'Emscripten contributors',
        project: 'Emscripten',
        description: 'Compiler toolchain that builds the C core to WebAssembly.',
        usage: 'core-dependency',
        usageNote: 'Build-time tool; its output ships with the app.',
        url: 'https://emscripten.org',
        license: 'MIT',
      },
    ],
  },
  {
    id: 'font',
    title: 'Font',
    entries: [
      {
        name: 'ChronoType (extended)',
        project: 'ChronoType',
        description: 'The typeface behind the ChronoKi look.',
        usage: 'assets-direct',
        usageNote: 'Used under CC BY-NC-SA 3.0: credit given, non-commercial use, shared under the same licence. Its license.txt and readme.txt ship with the app.',
        license: 'CC BY-NC-SA 3.0',
      },
    ],
  },
  {
    id: 'icons',
    title: 'Button & Controller Icons',
    entries: [
      {
        name: 'Kenney',
        project: 'Input Prompts',
        description: 'Free game asset pack with 1500+ controller button/stick/key SVG icons (64x64).',
        usage: 'assets-direct',
        usageNote: 'Switch, Xbox, PlayStation, GameCube, Keyboard, and Generic SVG icons used as-is for button prompts.',
        url: 'https://kenney.nl/assets/input-prompts',
        license: 'CC0',
      },
    ],
  },
  {
    id: 'research',
    title: 'Research & Thanks',
    entries: [
      {
        name: 'ThisIsAkill',
        project: 'ChronoRET',
        description: 'A byte-exact matching disassembly of Chrono Trigger.',
        usage: 'reference',
        usageNote: 'Read for how the game works; no code or data taken.',
        url: 'https://github.com/ThisIsAkill/ChronoRET',
        license: 'MIT',
      },
      {
        name: 'dscotton',
        project: 'ct_disassembly',
        description: 'A partial 65816 disassembly with RAM and hardware names.',
        usage: 'reference',
        usageNote: 'Read for symbol names and memory layout; no code or data taken.',
        url: 'https://github.com/dscotton/ct_disassembly',
        license: 'CC0',
      },
      {
        name: 'Chrono Compendium and Temporal Flux communities',
        project: 'Compendium, Temporal Flux',
        description: 'Community documentation of the game\'s data formats and systems.',
        usage: 'inspiration',
        usageNote: 'With thanks; consulted as research (see docs/port-research.md).',
      },
    ],
  },
];

export { CREDITS, USAGE_LABELS };
