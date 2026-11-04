/* @layer shared-asset-extraction @kind logic */
const refuse = (message: string): Error => new Error(message);

export { refuse };
