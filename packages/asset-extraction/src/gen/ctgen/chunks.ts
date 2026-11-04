/* @layer shared-asset-extraction @kind logic */
const chunks = <T>(values: readonly T[], per: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < values.length; i += per) out.push(values.slice(i, i + per));
  return out;
};

export { chunks };
