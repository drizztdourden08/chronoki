/* @layer shared-asset-extraction @kind types */
/** The C types a generated table can have (pack_tables.py Scalar / Pointer / Array / Struct). */
interface CScalar {
  tag: 'scalar';
  kind: string;
  size: number;
  align: number;
  signed: boolean;
}

/** `const char*`: the only pointer a table holds. Its size is the target's (4 on wasm32, 8 on native64). */
interface CPointer {
  tag: 'pointer';
  size: number;
  align: number;
}

interface CArray {
  tag: 'array';
  elem: CType;
  n: number;
  size: number;
  align: number;
}

interface CStructField {
  name: string;
  type: CType;
  offset: number;
}

interface CStruct {
  tag: 'struct';
  fields: CStructField[];
  size: number;
  align: number;
}

type CType = CScalar | CPointer | CArray | CStruct;

export type { CArray, CPointer, CScalar, CStruct, CStructField, CType };
