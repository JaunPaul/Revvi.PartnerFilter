import type { PartnerIndex } from './index-data'

export type WorkerState = {
  partnerIndex: PartnerIndex | null
}

export const state: WorkerState = {
  partnerIndex: null,
}
