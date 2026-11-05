/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { DEFAULT_GATES } from '../src';

describe('default gates', { tags: ['critical'] }, () => {
  it('turns Turbo on by default', () => {
    expect(DEFAULT_GATES).toContain('turbo');
  });
});
