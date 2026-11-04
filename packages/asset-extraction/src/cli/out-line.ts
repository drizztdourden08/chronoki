/* @layer shared-asset-extraction @kind logic */
const outLine = (line: string): void => {
  process.stdout.write(`${line}\n`);
};

export { outLine };
