import { z } from 'zod'

const safeText = z
  .string()
  .trim()
  .min(1)
  .refine(value => !/<[^>]*>|javascript:/i.test(value), {
    message: 'HTML and script content are not allowed'
  })

export const marketplaceFieldMappingSchema = z.object({
  platform: safeText,
  marketplaceName: safeText,
  fields: z.array(safeText).min(1),
  mapping: z.record(safeText, safeText)
})

export const adaptMarketplaceFieldsSchema = z.object({
  masterRecord: z.record(z.string(), z.unknown())
})
