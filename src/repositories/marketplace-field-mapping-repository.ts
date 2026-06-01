import { prisma } from '../database/prisma'
import {
  MarketplaceFieldMapping,
  UpsertMarketplaceFieldMappingInput
} from '../types/field-mapping'
import { mapMarketplaceFieldMapping } from './prisma-mappers'

export class MarketplaceFieldMappingRepository {
  async findAll() {
    const mappings =
      await prisma.marketplaceFieldMapping.findMany({
        orderBy: { marketplaceName: 'asc' }
      })

    return mappings.map(mapMarketplaceFieldMapping)
  }

  async findByPlatform(platform: string) {
    const mapping =
      await prisma.marketplaceFieldMapping.findUnique({
        where: { platform }
      })

    return mapping
      ? mapMarketplaceFieldMapping(mapping)
      : undefined
  }

  async upsert(
    input: UpsertMarketplaceFieldMappingInput
  ): Promise<MarketplaceFieldMapping> {
    const saved =
      await prisma.marketplaceFieldMapping.upsert({
        where: { platform: input.platform },
        create: {
          platform: input.platform,
          marketplaceName: input.marketplaceName,
          fields: input.fields as any,
          mapping: input.mapping as any
        },
        update: {
          marketplaceName: input.marketplaceName,
          fields: input.fields as any,
          mapping: input.mapping as any
        }
      })

    return mapMarketplaceFieldMapping(saved)
  }
}
