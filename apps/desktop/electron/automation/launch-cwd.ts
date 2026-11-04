/* @layer electron-main @kind logic */
// npm and pnpm set INIT_CWD to the folder the launch was typed in; Electron itself runs from the app folder.
const launchCwd = (): string => process.env.INIT_CWD ?? process.cwd();

export { launchCwd };
