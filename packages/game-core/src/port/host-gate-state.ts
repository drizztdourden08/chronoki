/* @layer bridge-wasm @kind logic */
const hostGateState: { effective: ReadonlySet<string>; listeners: Set<() => void> } = {
  effective: new Set<string>(),
  listeners: new Set<() => void>(),
};

export { hostGateState };
