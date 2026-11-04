/* @layer shared-asset-extraction @kind logic */
const errLine = (line: string): void => {
  process.stderr.write(`${line}\n`);
};

export { errLine };
