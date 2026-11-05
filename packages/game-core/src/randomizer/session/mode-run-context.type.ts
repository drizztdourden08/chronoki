/* @layer bridge-wasm @kind type */
import type { CtStartParty } from '../world/party/ct-party.type';

type ModeRunContext = { seed?: string; party?: CtStartParty; log?: (line: string) => void };

export type { ModeRunContext };
