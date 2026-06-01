import { ListingPlatform } from './listing'

export type MarketplaceFieldMapping = {
  id: string
  platform: ListingPlatform | string
  marketplaceName: string
  fields: string[]
  mapping: Record<string, string>
  createdAt: string
  updatedAt: string
}

export type UpsertMarketplaceFieldMappingInput = {
  platform: ListingPlatform | string
  marketplaceName: string
  fields: string[]
  mapping: Record<string, string>
}
