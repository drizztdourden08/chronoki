/* @layer renderer-components @kind logic */
const romFileOf = (profile: object | null | undefined): string | null => {
  const romFile: unknown = profile ? Reflect.get(profile, 'romFile') : null;
  return typeof romFile === 'string' && romFile !== '' ? romFile : null;
};

export { romFileOf };
