/* @layer renderer-appshell @kind logic */
const inputSuppressedFor = (running: boolean, screenOpen: boolean): boolean => !(running && !screenOpen);

export { inputSuppressedFor };
