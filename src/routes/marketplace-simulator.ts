import { Hono } from 'hono'
import { OrderSimulatorService } from '../services/order-simulator-service'
import { placeOrderSchema } from '../validators/order-simulator-validator'
import { parseJsonBody } from './request-json'

export const createMarketplaceSimulatorRouter = (
  simulator: OrderSimulatorService
) => {
  const app = new Hono()

  app.get('/marketplace-simulator/orders', async c =>
    c.json(await simulator.findOrders())
  )

  app.get(
    '/marketplace-simulator/:platform/listings',
    async c => {
      const listings =
        await simulator.findListingsByPlatform(
          c.req.param('platform')
        )

      return c.json(listings)
    }
  )

  app.post(
    '/marketplace-simulator/:platform/orders',
    async c => {
      const body = await parseJsonBody(c)

      if (!body.ok) {
        return body.response
      }

      const result = placeOrderSchema.safeParse(body.data)

      if (!result.success) {
        return c.json(
          {
            message: 'Invalid payload',
            errors: result.error.issues
          },
          400
        )
      }

      try {
        return c.json(
          await simulator.placeOrder({
            ...result.data,
            platform: c.req.param('platform')
          }),
          201
        )
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === 'LISTING_NOT_FOUND'
        ) {
          return c.json(
            { message: 'Listing not found' },
            404
          )
        }

        if (
          error instanceof Error &&
          error.message === 'INSUFFICIENT_INVENTORY'
        ) {
          return c.json(
            { message: 'Insufficient inventory' },
            409
          )
        }

        throw error
      }
    }
  )

  return app
}
