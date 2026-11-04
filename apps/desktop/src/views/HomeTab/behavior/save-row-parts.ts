/* @layer renderer-components @kind logic */
import { createElement } from 'react';
import type { ReactNode } from 'react';
import { DateText } from '@drizztdourden08/tessera/composites';
import type { ItemListRowParts } from '@drizztdourden08/tessera/composites';
import { Image, Span, Spinner } from '@drizztdourden08/tessera/primitives';
import { ARMED_PROMPTS } from '../HomeTab.constants';
import type { SaveRowPartsInput } from '../HomeTab.type';

const metaOf = ({ savedAt, busy, armed }: SaveRowPartsInput): ReactNode => {
  if (busy) return createElement(Spinner, { size: 'sm' });
  if (armed) return createElement(Span, { tone: 'primary' }, ARMED_PROMPTS[armed]);
  return createElement(DateText, { value: savedAt, format: 'relative' });
};

const saveRowParts = (input: SaveRowPartsInput): ItemListRowParts => ({
  media: createElement(Image, { src: input.screenshotUrl ?? undefined, alt: '', fit: 'cover', pixelated: true }),
  meta: metaOf(input),
});

export { saveRowParts };
