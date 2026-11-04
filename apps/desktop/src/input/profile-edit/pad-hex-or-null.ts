/* @layer renderer-lib @kind logic */
import { padHex } from '@chronoki/input-mapping';

const padHexOrNull = (value: string | null | undefined): string | null => (value ? padHex(value) : null);

export { padHexOrNull };
