import { ItemStatus } from '../interfaces/ItemStatus.enum';

export const ALLOWED_FROM: Record<ItemStatus, ItemStatus[]> = {
  [ItemStatus.RECEIVED]: [ItemStatus.PENDING_ASSEMBLY],
  [ItemStatus.PENDING_ASSEMBLY]: [ItemStatus.RECEIVED, ItemStatus.ASSEMBLING, ItemStatus.PAUSED],
  [ItemStatus.ASSEMBLING]: [ItemStatus.PENDING_ASSEMBLY, ItemStatus.PAUSED],
  [ItemStatus.READY]: [ItemStatus.ASSEMBLING],
  [ItemStatus.PAUSED]: [ItemStatus.ASSEMBLING],
  [ItemStatus.SOLD]: [ItemStatus.READY, ItemStatus.RECEIVED, ItemStatus.DAMAGED],
  [ItemStatus.DAMAGED]: [
    ItemStatus.RECEIVED,
    ItemStatus.PENDING_ASSEMBLY,
    ItemStatus.ASSEMBLING,
    ItemStatus.READY,
    ItemStatus.SOLD,
    ItemStatus.PAUSED,
  ],
};
