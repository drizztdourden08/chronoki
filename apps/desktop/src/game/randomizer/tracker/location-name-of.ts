/* @layer bridge-wasm @kind logic */
import { indexOfChecks } from './location-index';

const locationNameOf = (location: string): string => indexOfChecks().nameOf.get(location) ?? location;

export { locationNameOf };
