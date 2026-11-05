/* @layer bridge-wasm @kind logic */
import { chronokiApIdAdapters } from './chronoki-ap-id-adapters';

const chronokiApLocationKeyOf = (id: number, name: string): string | null => chronokiApIdAdapters.locationKeyOf(id, name);

export { chronokiApLocationKeyOf };
