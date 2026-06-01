import { Hono } from 'hono'
import { MarketplaceFieldMappingService } from '../services/marketplace-field-mapping-service'
import {
  adaptMarketplaceFieldsSchema,
  marketplaceFieldMappingSchema
} from '../validators/field-mapping-validator'
import { parseJsonBody } from './request-json'

export const createMarketplaceFieldMappingsRouter = (
  mappings: MarketplaceFieldMappingService
) => {
  const app = new Hono()

  app.get('/marketplace-field-mappings', async c =>
    c.json(await mappings.findAll())
  )

  app.get('/marketplace-field-mappings/:platform', async c => {
    const mapping = await mappings.findByPlatform(
      c.req.param('platform')
    )

    if (!mapping) {
      return c.json(
        { message: 'Marketplace mapping not found' },
        404
      )
    }

    return c.json(mapping)
  })

  app.put('/marketplace-field-mappings/:platform', async c => {
    const body = await parseJsonBody(c)

    if (!body.ok) {
      return body.response
    }

    const result =
      marketplaceFieldMappingSchema.safeParse({
        ...body.data,
        platform: c.req.param('platform')
      })

    if (!result.success) {
      return c.json(
        {
          message: 'Invalid payload',
          errors: result.error.issues
        },
        400
      )
    }

    return c.json(await mappings.upsert(result.data))
  })

  app.post(
    '/marketplace-field-mappings/:platform/adapt',
    async c => {
      const body = await parseJsonBody(c)

      if (!body.ok) {
        return body.response
      }

      const result =
        adaptMarketplaceFieldsSchema.safeParse(body.data)

      if (!result.success) {
        return c.json(
          {
            message: 'Invalid payload',
            errors: result.error.issues
          },
          400
        )
      }

      const adapted = await mappings.adapt(
        c.req.param('platform'),
        result.data.masterRecord
      )

      if (!adapted) {
        return c.json(
          { message: 'Marketplace mapping not found' },
          404
        )
      }

      return c.json(adapted)
    }
  )

  return app
}
