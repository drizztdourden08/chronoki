/* @layer shared-asset-extraction @kind types */
import type { OracleDriver } from '../../oracle/oracle-driver.type';

interface PeekRequest {
  state: Uint8Array;
  script: string | null;
  rule: boolean;
  frames: number | null;
  env: Record<string, string>;
}

interface PeekResult {
  fb: Uint8Array;
  wram: Uint8Array;
  vram: Uint8Array;
  oam: Uint8Array;
}

interface BootRequest {
  frames: number;
  sram: Uint8Array | null;
}

interface BootResult extends PeekResult {
  state: Uint8Array;
}

interface TeleportRequest {
  start: Uint8Array;
  scene: number;
  tx: number;
  ty: number;
  facing: number;
  frames: number;
}

interface OracleTools extends OracleDriver {
  peek: (request: PeekRequest) => Promise<PeekResult>;
  powerOn: (request: BootRequest) => Promise<BootResult>;
  teleport: (request: TeleportRequest) => Promise<Uint8Array>;
  monitorText: (state: Uint8Array, regs: string, frames: number) => Promise<string>;
  owforce: (state: Uint8Array, world: number) => Promise<Uint8Array>;
}

export type { BootRequest, BootResult, OracleTools, PeekRequest, PeekResult, TeleportRequest };
