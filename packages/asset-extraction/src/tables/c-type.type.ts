/* @layer shared-asset-extraction @kind types */
interface CScalar {
  tag: 'scalar';
  kind: string;
  size: number;
  align: number;
  signed: boolean;
}

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
