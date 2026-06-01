import { z } from 'zod'

const safeText = z
  .string()
  .trim()
  .min(1)
  .refine(value => !/<[^>]*>|javascript:/i.test(value), {
    message: 'HTML and script content are not allowed'
  })

export const placeOrderSchema = z.object({
  sku: safeText,
  sellerId: safeText.optional(),
  quantity: z.number().int().positive(),
  marketplaceOrderId: safeText.optional(),
  unitPrice: z.number().positive().optional(),
  webhookUrl: z.string().url().optional(),
  payload: z.record(z.string(), z.unknown()).optional()
})
