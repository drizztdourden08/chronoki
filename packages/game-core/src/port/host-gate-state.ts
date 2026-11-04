/* @layer bridge-wasm @kind logic */
const hostGateState: { effective: ReadonlySet<string> } = { effective: new Set<string>() };

export { hostGateState };
