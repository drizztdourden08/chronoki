/* @layer bridge-wasm @kind logic */
const idleTimer: { id: ReturnType<typeof setTimeout> | undefined } = { id: undefined };

export { idleTimer };
