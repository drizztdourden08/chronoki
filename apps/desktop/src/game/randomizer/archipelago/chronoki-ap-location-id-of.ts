/* @layer bridge-wasm @kind logic */
import { chronokiApIdAdapters } from './chronoki-ap-id-adapters';

const chronokiApLocationIdOf = (key: string): number | null => chronokiApIdAdapters.locationIdOf(key);

export { chronokiApLocationIdOf };
