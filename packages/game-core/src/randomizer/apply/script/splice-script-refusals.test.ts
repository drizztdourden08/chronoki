/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { encodeSetBits } from './encode-set-bits';
import { spliceFixture } from './script-splice.fixture';
import { spliceSceneScript } from './splice-scene-script';
import { tryEncodeSetBits } from './try-encode-set-bits';

const { CHANGE, RETURN, buildScript, jumpScene, packOf, splice } = spliceFixture;

const failedOf = (pack: Uint8Array, replace: number[]): string[] => {
  const result = spliceSceneScript(pack, splice(replace));
  return result.ok ? [] : result.failed;
};

describe('spliceSceneScript refusals', () => {
  it('refuses a jump that lands inside the replaced op', { tags: ['critical'] }, () => {
    const pack = packOf(buildScript([[0x10, 3, ...CHANGE, ...RETURN]]));
    expect(failedOf(pack, [0, 0])).toEqual(['test: jump at 0 lands inside the replaced op']);
  });

  it('refuses a displacement that would pass 0xFF', { tags: ['critical'] }, () => {
    const pack = packOf(buildScript(jumpScene));
    expect(failedOf(pack, new Array<number>(260).fill(0))).toContain('test: jump at 0 no longer reaches its target');
  });

  it('refuses a function pointer into the replaced op', { tags: ['critical'] }, () => {
    const script = buildScript(jumpScene);
    script[33] = 100;
    script[34] = 0;
    expect(failedOf(packOf(script), [0, 0]).length).toBeGreaterThan(0);
  });

  it('refuses a script that does not end exactly at the next function start', { tags: ['critical'] }, () => {
    const script = buildScript([[...CHANGE, 0x4a, 0x00]]);
    expect(failedOf(packOf(script), [0, 0])).toEqual([
      'test: script does not walk cleanly from function start to function start',
    ]);
  });

  it('refuses a result longer than 0x1700 bytes', { tags: ['critical'] }, () => {
    const pack = packOf(buildScript(jumpScene));
    expect(failedOf(pack, new Array<number>(0x1700).fill(0))).toEqual(['test: script would exceed 5888 bytes']);
  });

  it('turns a bad set-bits spec into a refusal and not a throw', { tags: ['critical'] }, () => {
    expect(() => encodeSetBits(0x7e0000, 1)).toThrow(RangeError);
    expect(tryEncodeSetBits(0x7e0000, 1).ok).toBe(false);
    expect(tryEncodeSetBits(0x7f0057, 0x80).ok).toBe(true);
  });

  it('turns a throwing anchor into a failed refusal', { tags: ['critical'] }, () => {
    const pack = packOf(buildScript(jumpScene));
    const throwing = { ...splice([0]), anchor: (): boolean => { throw new RangeError('boom'); } };
    expect(spliceSceneScript(pack, throwing)).toEqual({ ok: false, failed: ['test: boom'] });
  });
});
