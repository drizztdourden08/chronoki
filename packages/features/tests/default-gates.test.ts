/* @layer tests @kind test */
import { describe, expect, it } from 'vitest';
import { DEFAULT_GATES } from '../src';

describe('default gates', { tags: ['critical'] }, () => {
  it('leaves Turbo off until the user turns it on', () => {
    expect(DEFAULT_GATES).not.toContain('turbo');
  });
});
