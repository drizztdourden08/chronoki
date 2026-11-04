/* @layer bridge-wasm @kind type */
type GameInfoLocation = {
  readonly id: number;
  readonly overworld: boolean;
  readonly returnId: number;
  readonly lastInsideId: number;
  readonly arrivalX: number;
  readonly arrivalY: number;
  readonly leadX: number;
  readonly leadY: number;
  readonly epochX: number;
  readonly epochY: number;
  readonly epochBoarded: boolean;
};

type GameInfoSheet = {
  readonly id: number;
  readonly name: string | null;
  readonly level: number;
  readonly hp: number;
  readonly maxHp: number;
  readonly mp: number;
  readonly maxMp: number;
  readonly exp: number;
  readonly expToNext: number;
  readonly equipment: readonly number[];
  readonly ko: boolean;
};

type GameInfoParty = {
  readonly active: readonly (number | null)[];
  readonly reserve: readonly (number | null)[];
  readonly joinedMask: number;
  readonly sheets: readonly GameInfoSheet[];
};

type GameInfoClock = {
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
  readonly capped: boolean;
  readonly frozen: boolean;
};

type GameInfoItem = { readonly slot: number; readonly id: number; readonly count: number };

type GameInfoTechs = {
  readonly single: readonly (readonly boolean[])[];
  readonly progress: readonly number[];
  readonly multiLearned: number;
};

type GameInfoStory = { readonly counter: number; readonly chestsOpened: number };

type GameInfoSnapshot = {
  readonly location: GameInfoLocation;
  readonly party: GameInfoParty;
  readonly clock: GameInfoClock;
  readonly gold: number;
  readonly saveCount: number;
  readonly story: GameInfoStory;
  readonly inventory: readonly GameInfoItem[];
  readonly techs: GameInfoTechs;
  readonly songField: number;
  readonly songOverworld: number;
};

export type {
  GameInfoClock, GameInfoItem, GameInfoLocation, GameInfoParty, GameInfoSheet, GameInfoSnapshot, GameInfoStory,
  GameInfoTechs,
};
