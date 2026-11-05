/* @layer bridge-wasm @kind test */
import { describe, expect, it } from 'vitest';
import { readPackEntries } from '../checks/read-pack-entries';
import { applySeedToPack } from './apply-seed-to-pack';
import { planSpotGiftSplices } from './plan-spot-gift-splices';
import { spliceFixture } from './script/script-splice.fixture';

const { buildScript, le16, le32 } = spliceFixture;
const CYRUS_ANCHOR = [0x65, 0x86, 0xa3];
const OTHER = [0x65, 0x86, 0xf4];
const RETURN = [0x00];

const packOfScene = (scene: number, body: number[]): Uint8Array => {
  const blobs = [
    { type: 3, id: scene, data: [0, 0, 0, 0, 0, 0, 0, 0, ...le16(7), 0, 0] },
    { type: 16, id: 7, data: buildScript([body]) },
  ];
  const bytes: number[] = [0x43, 0x54, 0x41, 0x53, ...le32(1), ...le32(blobs.length)];
  let at = 12 + blobs.length * 16;
  blobs.forEach((blob) => {
    bytes.push(...le32(blob.type), ...le32(blob.id), ...le32(at), ...le32(blob.data.length));
    at += blob.data.length;
  });
  blobs.forEach((blob) => bytes.push(...blob.data));
  return Uint8Array.from(bytes);
};

const scriptOf = (pack: Uint8Array): number[] => {
  const entry = readPackEntries(pack).find((e) => e.type === 16 && e.id === 7);
  return entry ? [...pack.subarray(entry.start, entry.start + entry.length)] : [];
};

describe('planSpotGiftSplices', () => {
  it('plans nothing when no spot is switched on', { tags: ['critical'] }, () => {
    expect(planSpotGiftSplices({ 'ki-cyrus-grave': 0x42 })).toEqual({ splices: [], failed: [] });
  });

  it('puts the item give right after the anchor op', { tags: ['critical'] }, () => {
    const plan = planSpotGiftSplices({ 'ki-cyrus-grave': 0x42 }, ['ki-cyrus-grave']);
    expect(plan.failed).toEqual([]);
    expect(plan.splices).toHaveLength(1);
    expect(plan.splices[0]?.scene).toBe(0x049);
    expect([...(plan.splices[0]?.replace ?? [])]).toEqual([...CYRUS_ANCHOR, 0xca, 0x42]);
    expect(plan.splices[0]?.anchor(Uint8Array.from(CYRUS_ANCHOR))).toBe(true);
    expect(plan.splices[0]?.anchor(Uint8Array.from(OTHER))).toBe(false);
  });

  it('targets Ozzie\'s Fort in its own scene', { tags: ['critical'] }, () => {
    const plan = planSpotGiftSplices({ 'ki-ozzies-fort': 0xd7 }, ['ki-ozzies-fort']);
    expect(plan.splices.map((splice) => splice.scene)).toEqual([0x0b5]);
  });

  it('refuses an item the add-item op cannot carry and skips an unplaced spot', { tags: ['critical'] }, () => {
    expect(planSpotGiftSplices({ 'ki-cyrus-grave': 0x1ff }, ['ki-cyrus-grave']).failed).toEqual(['ki-cyrus-grave']);
    expect(planSpotGiftSplices({}, ['ki-cyrus-grave'])).toEqual({ splices: [], failed: [] });
  });
});

describe('applySeedToPack with spot gifts', () => {
  const body = [...OTHER, ...CYRUS_ANCHOR, ...RETURN];

  it('adds the item give to the scene script', { tags: ['critical'] }, () => {
    const pack = packOfScene(0x049, body);
    const result = applySeedToPack(pack, { 'ki-cyrus-grave': 0x42 }, [], { spotGifts: ['ki-cyrus-grave'] });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(scriptOf(result.bytes)).toEqual(buildScript([[...OTHER, ...CYRUS_ANCHOR, 0xca, 0x42, ...RETURN]]));
  });

  it('refuses a spot key when its option is off', { tags: ['critical'] }, () => {
    const result = applySeedToPack(packOfScene(0x049, body), { 'ki-cyrus-grave': 0x42 });
    expect(result).toEqual({ ok: false, failed: ['ki-cyrus-grave'] });
  });

  it('refuses when the anchor is missing from the scene', { tags: ['critical'] }, () => {
    const pack = packOfScene(0x049, [...OTHER, ...RETURN]);
    expect(applySeedToPack(pack, { 'ki-cyrus-grave': 0x42 }, [], { spotGifts: ['ki-cyrus-grave'] }).ok).toBe(false);
  });

  it('leaves the pack byte-identical when the option is off', { tags: ['critical'] }, () => {
    const pack = packOfScene(0x049, body);
    const result = applySeedToPack(pack, {});
    expect(result.ok && [...result.bytes]).toEqual([...pack]);
  });
});
