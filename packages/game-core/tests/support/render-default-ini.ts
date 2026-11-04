/* @layer tests @kind test-support */
import { ENUM_DEFAULTS, KEY_FIELDS, PAD_NAMES, SCANCODE_NAMES } from './settings-c.constants';

const between = (src: string, from: string, to?: string): string => {
  const start = src.indexOf(from);
  const end = to ? src.indexOf(to, start) : src.length;
  return src.slice(start, end);
};

const defaultsBody = (src: string): string =>
  between(src, 'void CtSettingsDefaults', 'CtSettings* CtSettingsGet')
    .replace(/#ifdef __ANDROID__[\s\S]*?#else/, '')
    .replace('#endif', '');

const arrayTokens = (body: string, name: string, prefix: string): string[] => {
  const match = new RegExp(`${name}\\[CT_BTN_COUNT\\] = \\{([^}]*)\\}`).exec(body);
  return [...(match?.[1] ?? '').matchAll(new RegExp(`${prefix}(\\w+)`, 'g'))].map((m) => m[1] ?? '');
};

const keyName = (token: string): string => SCANCODE_NAMES[token] ?? token;

const buttonStems = (src: string): string[] => {
  const match = /BTN_KEY\[CT_BTN_COUNT\] = \{([^}]*)\}/.exec(src);
  return [...(match?.[1] ?? '').matchAll(/"(\w+)"/g)].map((m) => m[1] ?? '');
};

const scalarDefault = (body: string, key: string): string => {
  const field = KEY_FIELDS[key];
  if (!field) throw new Error(`no default known for ini key ${key}`);
  return new RegExp(`s->${field}\\s*=\\s*(-?\\d+)`).exec(body)?.[1] ?? '0';
};

const controlLines = (src: string, body: string): string => {
  const keys = arrayTokens(body, 'k0', 'SDL_SCANCODE_').map(keyName);
  const pads = arrayTokens(body, 'p0', 'SDL_CONTROLLER_BUTTON_').map((token) => PAD_NAMES[token] ?? token);
  const second = new Map(
    [...body.matchAll(/s->keys\[CT_BTN_(\w+)\]\[1\] = SDL_SCANCODE_(\w+)/g)].map((m) => [(m[1] ?? '').toLowerCase(), keyName(m[2] ?? '')]),
  );
  return buttonStems(src)
    .map((stem, i) => `key_${stem}=${keys[i]}\nkey2_${stem}=${second.get(stem) ?? ''}\npad_${stem}=${pads[i]}\n`)
    .join('');
};

const fill = (literal: string, body: string): string =>
  literal
    .split('\n')
    .map((line) => {
      const match = /^(\w+)=%[ds]$/.exec(line);
      if (!match) return line;
      const key = match[1] ?? '';
      return `${key}=${ENUM_DEFAULTS[key] ?? scalarDefault(body, key)}`;
    })
    .join('\n');

const renderDefaultIni = (src: string): string => {
  const body = defaultsBody(src);
  const save = between(src, 'int CtSettingsSave');
  const literals = [...save.matchAll(/fprintf\(f, "((?:[^"\\]|\\.)*)"/g)].map((m) => (m[1] ?? '').replace(/\\n/g, '\n'));
  return literals
    .map((literal) => {
      if (literal.startsWith('key_%s')) return controlLines(src, body);
      if (literal.includes('_%s=%s')) return '';
      return fill(literal, body);
    })
    .join('');
};

export { renderDefaultIni };
