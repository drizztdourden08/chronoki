/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { DEFAULT_GATE_OPTIONS } from '@chronoki/features';
import { buildCoreConfigIni, gateSettings } from '../src';

const audio = { volume: 100, mute: false };
const tallOptions = { ...DEFAULT_GATE_OPTIONS, aspectRatio: '3:4' } as const;

describe('camera lock ini key', { tags: ['critical'] }, () => {
  it('writes camera_lock=1 or 0 beside a tall or wide picture', () => {
    const tall = buildCoreConfigIni({ tallLines: 340, cameraLock: true }).split('\n');
    expect(tall).toContain('camera_lock=1');
    expect(buildCoreConfigIni({ tallLines: 340, cameraLock: false }).split('\n')).toContain('camera_lock=0');
    expect(buildCoreConfigIni({ widescreen: '16:9', wideWidth: 398, cameraLock: false }).split('\n')).toContain('camera_lock=0');
  });

  it('writes nothing for the original 256 x 224 picture, so the file stays Belthasar\'s own', () => {
    expect(buildCoreConfigIni({ cameraLock: true })).not.toContain('camera_lock');
    expect(buildCoreConfigIni()).not.toContain('camera_lock');
  });
});

describe('camera lock gate', { tags: ['critical'] }, () => {
  it('follows the cameraLock gate', () => {
    expect(gateSettings(new Set(['aspectRatio', 'cameraLock']), tallOptions, audio).cameraLock).toBe(true);
    expect(gateSettings(new Set(['aspectRatio']), tallOptions, audio).cameraLock).toBe(false);
    expect(gateSettings(new Set(), DEFAULT_GATE_OPTIONS, audio).cameraLock).toBe(false);
  });
});
