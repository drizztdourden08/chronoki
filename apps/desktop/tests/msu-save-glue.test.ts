/* @layer tests @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  active: true,
  snapshot: null as { trackNum: number; layers: number[] } | null,
  write: vi.fn(),
  del: vi.fn(),
  read: vi.fn(),
  restore: vi.fn(),
}));

vi.mock('@drizztdourden08/brock-msu/packs', () => ({
  writeMsuResume: mocks.write,
  deleteMsuResume: mocks.del,
  readMsuResume: mocks.read,
}));
vi.mock('@app/game/msu-session', () => ({
  isMsuSessionActive: () => mocks.active,
  msuSnapshot: () => mocks.snapshot,
  msuRestore: mocks.restore,
}));
vi.mock('@app/storage/platform-files', () => ({ platformFiles: () => ({}) }));
vi.mock('@app/log/app-log', () => ({ appLog: { warn: vi.fn(), info: vi.fn(), error: vi.fn() } }));

const { saveMusicPosition } = await import('@app/game/msu-save-glue/save-music-position');
const { restoreMusicPosition } = await import('@app/game/msu-save-glue/restore-music-position');

const quick = { kind: 'quick', slot: 1 } as const;

beforeEach(() => {
  mocks.active = true;
  mocks.snapshot = null;
  vi.clearAllMocks();
});

describe('saveMusicPosition', { tags: ['critical'] }, () => {
  it('writes the sidecar when the session has a track state', async () => {
    mocks.snapshot = { trackNum: 24, layers: [0] };
    await saveMusicPosition('p1', quick);
    expect(mocks.write).toHaveBeenCalledTimes(1);
  });

  it('never deletes an existing sidecar when the snapshot is missing', async () => {
    await saveMusicPosition('p1', quick);
    expect(mocks.write).not.toHaveBeenCalled();
    expect(mocks.del).not.toHaveBeenCalled();
  });

  it('leaves everything alone with no session', async () => {
    mocks.active = false;
    mocks.snapshot = { trackNum: 24, layers: [0] };
    await saveMusicPosition('p1', quick);
    expect(mocks.write).not.toHaveBeenCalled();
    expect(mocks.del).not.toHaveBeenCalled();
  });
});

describe('restoreMusicPosition', { tags: ['critical'] }, () => {
  it('restores once when called twice for the same slot at the same time', async () => {
    mocks.read.mockResolvedValue({ trackNum: 24, layers: [0] });
    await Promise.all([restoreMusicPosition('p1', quick), restoreMusicPosition('p1', quick)]);
    expect(mocks.restore).toHaveBeenCalledTimes(1);
  });

  it('restores again on a later load of the same slot', async () => {
    mocks.read.mockResolvedValue({ trackNum: 24, layers: [0] });
    await restoreMusicPosition('p1', quick);
    await restoreMusicPosition('p1', quick);
    expect(mocks.restore).toHaveBeenCalledTimes(2);
  });

  it('skips a slot with no sidecar', async () => {
    mocks.read.mockResolvedValue(null);
    await restoreMusicPosition('p1', quick);
    expect(mocks.restore).not.toHaveBeenCalled();
  });
});
