/* @layer shared-asset-extraction @kind types */
interface Generator {
  out: string[];
  cmd: string[];
  stdout?: boolean;
  stage?: string;
  status: string;
  recipes?: string[];
  needs?: string[];
}

interface ManifestFile {
  name: string;
  text: string;
}

export type { Generator, ManifestFile };
