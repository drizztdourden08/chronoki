/* @layer electron-main @kind logic */
const launchCwd = (): string => process.env.INIT_CWD ?? process.cwd();

export { launchCwd };
