/* @layer bridge-wasm @kind logic */
const nearestStop = (stops: readonly number[], value: number): number => {
  const [first] = stops;
  if (first === undefined) return value;
  let best = first;
  let bestDistance = Math.abs(first - value);
  for (const stop of stops) {
    const distance = Math.abs(stop - value);
    if (distance < bestDistance) {
      best = stop;
      bestDistance = distance;
    }
  }
  return best;
};

export { nearestStop };
