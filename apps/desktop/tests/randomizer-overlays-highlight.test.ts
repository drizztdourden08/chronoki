/* @layer tests @kind test */
import type { ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_HIGHLIGHTS } from '@app/settings-controls/highlight/highlight.constants';

const mocks = vi.hoisted(() => {
  const holder: { settings: Record<string, string> } = { settings: {} };
  return holder;
});

vi.mock('@drizztdourden08/brock-react', () => ({ useSettings: () => ({ settings: mocks.settings }) }));
vi.mock('@drizztdourden08/brock-randomizer/renderer', () => ({ CheckToasts: 'CheckToasts', DeliveryQueueIndicator: 'DeliveryQueueIndicator' }));
vi.mock('@drizztdourden08/tessera/primitives', () => ({ Box: 'Box' }));
vi.mock('@app/views/RandomizerOverlays/behavior/useIsRandomizerRun', () => ({ useIsRandomizerRun: () => true }));
vi.mock('@app/views/RandomizerOverlays/behavior/useCheckToastsEnabled', () => ({ useCheckToastsEnabled: () => true }));
vi.mock('@app/views/RandomizerOverlays/behavior/useNoticeShown', () => ({ useNoticeShown: () => () => undefined }));
vi.mock('@app/views/RandomizerOverlays/RandomizerOverlays.css', () => ({}));

const { RandomizerOverlays } = await import('@app/views/RandomizerOverlays/RandomizerOverlays');

const toastProps = (): Record<string, unknown> => {
  const root = RandomizerOverlays({ profileId: 'p1' }) as ReactElement<{ children: ReactElement<Record<string, unknown>>[] }>;
  const toasts = root.props.children.find((child) => child.type === 'CheckToasts');
  return toasts?.props ?? {};
};

beforeEach(() => {
  mocks.settings = {};
});

describe('online notices are tinted by the highlight colours', { tags: ['critical'] }, () => {
  it('passes the primary colour as the item colour and the secondary as the player colour', () => {
    mocks.settings = { hudHighlightPrimary: '#112233', hudHighlightSecondary: '#445566' };
    const props = toastProps();
    expect(props.itemColor).toBe('#112233');
    expect(props.playerColor).toBe('#445566');
  });

  it('follows a changed setting on the next render', () => {
    mocks.settings = { hudHighlightPrimary: '#aaaaaa', hudHighlightSecondary: '#bbbbbb' };
    expect(toastProps().itemColor).toBe('#aaaaaa');
    mocks.settings = { hudHighlightPrimary: '#cccccc', hudHighlightSecondary: '#dddddd' };
    expect(toastProps()).toMatchObject({ itemColor: '#cccccc', playerColor: '#dddddd' });
  });

  it('carries the default highlight colours when the settings hold the defaults', () => {
    mocks.settings = { ...DEFAULT_HIGHLIGHTS };
    expect(toastProps()).toMatchObject({ itemColor: DEFAULT_HIGHLIGHTS.hudHighlightPrimary, playerColor: DEFAULT_HIGHLIGHTS.hudHighlightSecondary });
  });
});
