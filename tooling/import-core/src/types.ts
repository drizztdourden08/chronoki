export type Pin = {
  repo: string;
  tag: string;
  commit: string;
  licence: string;
};

export type ImportedFile = {
  path: string;
  sha256: string;
};

export type Manifest = {
  repo: string;
  tag: string;
  commit: string;
  licence: string;
  date: string;
  files: ImportedFile[];
};

export class ImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImportError";
  }
}
