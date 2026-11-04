/* @layer shared-asset-extraction @kind logic @source Python text._font8, text.decode_mapped, text.item_names, text.read_string_list */
import { parseCharacter } from './parse-character';

const buildFont8 = (): string[] => {
  const m: string[] = Array.from({ length: 256 }, () => '');
  const icons = ['<BLADE>', '<BOW>', '<GUN>', '<ARM>', '<SWORD>', '<FIST>', '<SCYTHE>', '<HELM>', '<ARMOR>', '<RING>',
    '<H>', '<M>', '<P>', '<:>', '<SHIELD>', '<STAR>'];
  icons.forEach((s, i) => (m[0x20 + i] = s));
  ['<LEFT>', '<RIGHT>', '(', ')', ':'].forEach((s, i) => (m[0x5b + i] = s));
  ['<HAND1>', '<HAND2>', '<HAND3>', '<HAND4>', '<H>', '<M>', '<P>'].forEach((s, i) => (m[0x60 + i] = s));
  for (let i = 0; i < 9; i += 1) m[0x67 + i] = `<HP${i}>`;
  m[0x72] = '°';
  for (let i = 0; i < 10; i += 1) m[0x73 + i] = String.fromCharCode(0x30 + i);
  m[0x7d] = '<D>';
  m[0x7e] = '<Z>';
  m[0x7f] = '<UP>';
  for (let v = 0xa0; v < 0xf4; v += 1) m[v] = parseCharacter(v);
  m[0xff] = ' ';
  return m;
};

const font8Map = buildFont8();

const rstrip = (s: string): string => s.replace(/\s+$/u, '');

const decodeMapped = (data: Uint8Array): string => rstrip(Array.from(data, (b) => (font8Map[b] as string)).join(''));

const itemNames = (rom: Uint8Array): string[] => {
  const data = rom.slice(0xc0b5e, 0xc0b5e + 0xa71);
  const out: string[] = [];
  for (let i = 0; i < Math.floor(data.length / 11); i += 1) out.push(decodeMapped(data.slice(i * 11, i * 11 + 11)));
  return out;
};

export { itemNames };
