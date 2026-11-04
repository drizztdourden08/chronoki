/* @layer shared-asset-extraction @kind types */
interface SteamArchive {
  read: (offset: number, length: number) => Promise<Uint8Array>;
}

type SteamFiles = Map<string, [number, number]>;

export type { SteamArchive, SteamFiles };
