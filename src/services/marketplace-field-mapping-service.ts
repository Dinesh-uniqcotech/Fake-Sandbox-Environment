import { defaultMarketplaceFieldMappings } from '../config/marketplace-field-defaults'
import { MarketplaceFieldMappingRepository } from '../repositories/marketplace-field-mapping-repository'
import {
  MarketplaceFieldMapping,
  UpsertMarketplaceFieldMappingInput
} from '../types/field-mapping'

const objectRecord = (value: unknown) =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}

export class MarketplaceFieldMappingService {
  constructor(
    private readonly mappings: MarketplaceFieldMappingRepository
  ) {}

  async findAll() {
    await this.ensureDefaults()
    return this.mappings.findAll()
  }

  async findByPlatform(platform: string) {
    await this.ensureDefaults()
    return this.mappings.findByPlatform(platform)
  }

  upsert(input: UpsertMarketplaceFieldMappingInput) {
    return this.mappings.upsert(input)
  }

  async adapt(
    platform: string,
    masterRecord: Record<string, unknown>
  ) {
    const config = await this.findByPlatform(platform)

    if (!config) {
      return undefined
    }

    return this.applyMapping(config, masterRecord)
  }

  private applyMapping(
    config: MarketplaceFieldMapping,
    masterRecord: Record<string, unknown>
  ) {
    const platformFields: Record<string, unknown> = {}

    for (const [masterField, platformField] of Object.entries(
      config.mapping
    )) {
      if (masterField in masterRecord) {
        platformFields[platformField] =
          masterRecord[masterField]
      }
    }

    return {
      platform: config.platform,
      marketplaceName: config.marketplaceName,
      requiredFields: config.fields,
      fields: platformFields
    }
  }

  private async ensureDefaults() {
    const existing = await this.mappings.findAll()
    const existingPlatforms = new Set(
      existing.map(mapping => mapping.platform)
    )

    for (const mapping of defaultMarketplaceFieldMappings) {
      if (!existingPlatforms.has(mapping.platform)) {
        await this.mappings.upsert({
          ...mapping,
          mapping: objectRecord(mapping.mapping) as Record<
            string,
            string
          >
        })
      }
    }
  }
}
