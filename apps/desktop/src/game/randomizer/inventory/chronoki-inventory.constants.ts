/* @layer bridge-wasm @kind constants */
import type { InventoryProvider, InventorySlot } from '@drizztdourden08/brock-randomizer';
import { CT_CHARACTER_ORDER, CT_KEY_ITEMS, CT_KEY_ITEM_NAMES } from '@chronoki/game-core';

const KEY_ITEM_ROW_SIZE = 5;

const CHARACTER_LABELS: Readonly<Record<string, string>> = {
  crono: 'Crono', marle: 'Marle', lucca: 'Lucca', robo: 'Robo', frog: 'Frog', ayla: 'Ayla',
};

const keyItemSlots: readonly InventorySlot[] = CT_KEY_ITEMS.map((item) => ({
  id: item, label: CT_KEY_ITEM_NAMES[item], tiers: [item],
}));

const partySlots: readonly InventorySlot[] = CT_CHARACTER_ORDER.map((character) => ({
  id: character, label: CHARACTER_LABELS[character] ?? character, tiers: [character],
}));

const rowsOf = (slots: readonly InventorySlot[]): readonly (readonly InventorySlot[])[] =>
  Array.from({ length: Math.ceil(slots.length / KEY_ITEM_ROW_SIZE) }, (_, row) =>
    slots.slice(row * KEY_ITEM_ROW_SIZE, (row + 1) * KEY_ITEM_ROW_SIZE));

const CHRONOKI_INVENTORY: InventoryProvider = {
  layouts: [{
    id: 'default',
    label: 'Default',
    areas: [
      { id: 'key-items', label: 'Key items', rows: rowsOf(keyItemSlots) },
      { id: 'party', label: 'Party', rows: rowsOf(partySlots) },
    ],
  }],
};

export { CHRONOKI_INVENTORY };
