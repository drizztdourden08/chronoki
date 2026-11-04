/* @layer shared-asset-extraction @kind logic */

const inflate = async (data: Uint8Array, format: 'gzip' | 'deflate'): Promise<Uint8Array> => {
  const stream = new Blob([new Uint8Array(data)]).stream().pipeThrough(new DecompressionStream(format));
  return new Uint8Array(await new Response(stream).arrayBuffer());
};

export { inflate };
