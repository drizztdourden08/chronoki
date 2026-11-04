import { readFile } from "node:fs/promises";
import { pinPath } from "./paths.ts";
import { ImportError } from "./types.ts";
import type { Pin } from "./types.ts";

const isFullSha = (value: unknown): boolean => typeof value === "string" && /^[0-9a-f]{40}$/.test(value);

export const readPin = async (): Promise<Pin> => {
  let raw: string;
  try {
    raw = await readFile(pinPath, "utf8");
  } catch {
    throw new ImportError(`Cannot read the pin file ${pinPath}`);
  }
  const pin = JSON.parse(raw) as Partial<Pin>;
  if (typeof pin.repo !== "string" || typeof pin.tag !== "string" || typeof pin.licence !== "string") {
    throw new ImportError("belthasar.pin.json needs repo, tag, commit and licence");
  }
  if (!isFullSha(pin.commit)) throw new ImportError("belthasar.pin.json: commit must be a full 40-character SHA");
  if (pin.licence !== "MIT") throw new ImportError(`Pinned licence is ${pin.licence}; only MIT is accepted`);
  return pin as Pin;
};
