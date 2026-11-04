/* @layer shared-asset-extraction @kind constants */
const TOKEN =
  /(?<ws>\s+)|(?<num>0[xX][0-9A-Fa-f]+[uUlL]*|\d+[uUlL]*)|(?<id>[A-Za-z_]\w*)|(?<str>"(?:[^"\\\n]|\\.)*")|(?<chr>'(?:[^'\\\n]|\\.)+')|(?<op><<|>>|[{}[\]();,=*+\-/%&|^~!?:.<>])/y;

export { TOKEN };
