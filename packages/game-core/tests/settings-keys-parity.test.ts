/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { FEATURE_REGISTRY } from '@chronoki/features';
import { buildCoreConfigIni } from '../src';
import { readSettingsC } from './support/find-settings-c';

const settingsC = readSettingsC();
const withReference = settingsC ? it : it.skip;

const CONTROL_KEY = /^(key|key2|pad)_(\w+)$/;
const HOST_READ_KEYS = new Set(['video.wide_width', 'video.tall_lines', 'video.camera_lock',
  'chronoki.sightscope', 'chronoki.visible_techs', 'chronoki.dim_flashes', 'chronoki.dialog_controls', 'chronoki.dialog_speed_q4', 'chronoki.dialog_hold_q4',
  'chronoki.dialog_hold', 'chronoki.dialog_fill', 'chronoki.dialog_auto_skip', 'chronoki.duplicate_characters', 'game.randomizer', 'game.disable_glitches']);

const readLoadedKeys = (src: string): Set<string> => {
  const body = src.slice(src.indexOf('static void setKey'), src.indexOf('int CtSettingsLoad'));
  const found = new Set<string>();
  let section = '';
  for (const match of body.matchAll(/strcmp\(sec, "(\w+)"\)|strcmp\(key, "(\w+)"\)/g)) {
    if (match[1]) section = match[1];
    else if (match[2]) found.add(`${section}.${match[2]}`);
  }
  return found;
};

const readStems = (src: string): Set<string> => {
  const match = /BTN_KEY\[CT_BTN_COUNT\] = \{([^}]*)\}/.exec(src);
  return new Set([...(match?.[1] ?? '').matchAll(/"(\w+)"/g)].map((m) => m[1] ?? ''));
};

const writtenKeys = (): string[] => {
  const keys: string[] = [];
  let section = '';
  for (const line of buildCoreConfigIni({ sightscope: true, visibleTechs: true, dimFlashes: true, dialogControls: true }, { randomizer: true, disableGlitches: false, duplicateCharacters: true }).split('\n')) {
    const header = /^\[(\w+)\]$/.exec(line);
    if (header) section = header[1] ?? '';
    else if (line.includes('=')) keys.push(`${section}.${line.slice(0, line.indexOf('='))}`);
  }
  return keys;
};

const isKnown = (qualified: string, loaded: Set<string>, stems: Set<string>): boolean => {
  if (loaded.has(qualified) || HOST_READ_KEYS.has(qualified)) return true;
  const [section, key = ''] = qualified.split('.');
  const control = CONTROL_KEY.exec(key);
  return section === 'controls' && control !== null && stems.has(control[2] ?? '');
};

describe('ini keys exist in settings.c', { tags: ['critical'] }, () => {
  withReference('every key the writer emits is read by Belthasar', () => {
    const src = settingsC ?? '';
    const loaded = readLoadedKeys(src);
    const stems = readStems(src);
    const unknown = writtenKeys().filter((qualified) => !isKnown(qualified, loaded, stems));
    expect(unknown).toEqual([]);
  });

  withReference('every registry iniKey exists in settings.c', () => {
    const loaded = readLoadedKeys(settingsC ?? '');
    const missing = FEATURE_REGISTRY.flatMap((feature) => (feature.iniKey ? [feature.iniKey] : []))
      .map(({ section, key }) => `${section}.${key}`)
      .filter((qualified) => !loaded.has(qualified) && !HOST_READ_KEYS.has(qualified));
    expect(missing).toEqual([]);
  });

  it('every registry iniKey is a key the writer emits', () => {
    const written = new Set(writtenKeys());
    const missing = FEATURE_REGISTRY.flatMap((feature) => (feature.iniKey ? [feature.iniKey] : []))
      .map(({ section, key }) => `${section}.${key}`)
      .filter((qualified) => !written.has(qualified));
    expect(missing).toEqual([]);
  });
});
