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
    id: 'controllers',
    title: 'Controller Support',
    entries: [
      {
        name: 'Sam Lantinga + contributors',
        project: 'SDL',
        description: 'Cross-platform library that handles controller input, rumble and motion sensors.',
        usage: 'core-dependency',
        usageNote: 'The entire controller layer on every platform. Built from SDL’s official released source: linked as a shared library on desktop, and compiled into the mobile plugin along with SDL’s own Java classes, which are taken from that same pinned release at build time instead of being copied into this repository.',
        url: 'https://github.com/libsdl-org/SDL',
        license: 'Zlib',
      },
      {
        name: 'mdqinc + contributors',
        project: 'SDL_GameControllerDB',
        description: 'A community-sourced database of game controller mappings for SDL.',
        usage: 'data-direct',
        usageNote: 'Controller mapping database vendored and parsed into TypeScript controller list.',
        url: 'https://github.com/mdqinc/SDL_GameControllerDB',
        license: 'Zlib',
      },
      {
        name: 'HandHeldLegend',
        project: 'procon2tool',
        description: 'Open-source utility to enable the Switch Pro Controller 2 on Windows/Android.',
        usage: 'reference',
        usageNote: 'USB init sequence and haptic patterns studied and reimplemented in TypeScript; no code copied directly.',
        url: 'https://handheldlegend.github.io/procon2tool',
      },
      {
        name: 'RyanCopley',
        project: 'NSO-GameCube-Controller-Pairing-App',
        description: 'Tool to use the NSO GameCube controller on Windows/macOS/Linux.',
        usage: 'reference',
        usageNote: 'Studied to understand NSO GameCube controller pairing protocol; no code taken, used as debugging reference.',
        url: 'https://github.com/RyanCopley/NSO-GameCube-Controller-Pairing-App',
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
      {
        name: 'Tiago Alexander',
        project: 'SNES Controller in Sketch',
        description: 'High-fidelity SNES controller design in Sketch format.',
        usage: 'assets-modified',
        usageNote: 'Sketch file converted to Figma, individual button SVGs exported and heavily modified for SNES button prompts.',
        url: 'https://www.sketchappsources.com/free-source/4788-snes-controller-sketch-freebie-resource.html',
      },
    ],
  },
  {
    id: 'randomizer',
    title: 'Randomizer Logic',
    entries: [
      {
        name: 'Archipelago',
        project: 'Archipelago Multiworld',
        description: 'Cross-game randomizer and multiworld system.',
        usage: 'logic-port',
        usageNote: 'Randomizer logic (regions, access rules, item pool, fill validity) ported to TypeScript; location and item naming follows its conventions.',
        url: 'https://archipelago.gg',
        license: 'MIT',
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
