/* @layer shared @kind types */
interface ResolveGatesOptions {
  vanillaSafe: boolean;
  packaged?: boolean;
  satisfied?: ReadonlySet<string>;
}

export type { ResolveGatesOptions };
