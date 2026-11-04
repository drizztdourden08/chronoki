/* @layer bridge-wasm @kind logic */
const pad = (value: number): string => String(value).padStart(2, '0');

const screenshotName = (at: Date): string => {
  const day = `${at.getFullYear()}${pad(at.getMonth() + 1)}${pad(at.getDate())}`;
  const time = `${pad(at.getHours())}${pad(at.getMinutes())}${pad(at.getSeconds())}`;
  return `ChronoKi-${day}-${time}.png`;
};

export { screenshotName };
