/* @layer shared-asset-extraction @kind constants */
import type { CScalar } from './c-type.type';
import { makeScalar } from './c-types';

const U8 = makeScalar('u8', 1, false);
const I8 = makeScalar('i8', 1, true);
const U16 = makeScalar('u16', 2, false);
const I16 = makeScalar('i16', 2, true);
const U32 = makeScalar('u32', 4, false);
const I32 = makeScalar('i32', 4, true);

/** pack_tables.py SCALARS, keyed by the type words joined with a space ("unsigned short int"). */
const SCALAR_TYPES: Record<string, CScalar> = {
  uint8_t: U8,
  int8_t: I8,
  uint16_t: U16,
  int16_t: I16,
  uint32_t: U32,
  int32_t: I32,
  uint64_t: makeScalar('u64', 8, false),
  int64_t: makeScalar('i64', 8, true),
  char: makeScalar('c8', 1, false),
  'signed char': I8,
  'unsigned char': U8,
  short: I16,
  'signed short': I16,
  'unsigned short': U16,
  'short int': I16,
  'unsigned short int': U16,
  int: I32,
  signed: I32,
  'signed int': I32,
  unsigned: U32,
  'unsigned int': U32,
};

const CHAR_KINDS: readonly string[] = ['c8', 'u8', 'i8'];

export { CHAR_KINDS, SCALAR_TYPES };
