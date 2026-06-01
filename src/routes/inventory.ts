import { Hono } from 'hono'
import { InventoryService } from '../services/inventory-service'
import { inventoryUpdateSchema } from '../validators/inventory-validator'
import { parseJsonBody } from './request-json'

const normalizeSku = (sku: string) => sku.trim()
const positiveIntegerQuery = (
  value: string | undefined,
  fallback?: number
) => {
  const parsed = value ? Number(value) : fallback

  return typeof parsed === 'number' &&
    Number.isInteger(parsed) &&
    parsed > 0
    ? parsed
    : fallback
}

export const createInventoryRouter = (
  inventory: InventoryService
) => {
  const app = new Hono()

  app.get('/inventory', async c =>
    c.json(
      await inventory.findAll({
        limit: positiveIntegerQuery(
          c.req.query('limit'),
          50
        ),
        offset: positiveIntegerQuery(
          c.req.query('offset'),
          0
        ),
        below: positiveIntegerQuery(c.req.query('below'))
      })
    )
  )

  app.get('/inventory-summary', async c =>
    c.json(await inventory.getSummary())
  )

  app.patch('/inventory/:sku', async c => {
    const body = await parseJsonBody(c)

    if (!body.ok) {
      return body.response
    }

    const result =
      inventoryUpdateSchema.safeParse(body.data)

    if (!result.success) {
      return c.json(
        {
          message: 'Invalid payload',
          errors: result.error.issues
        },
        400
      )
    }

    return c.json(
      await inventory.updateQuantity(
        normalizeSku(c.req.param('sku')),
        result.data.quantity
      )
    )
  })

  app.get('/inventory/:sku', async c => {
    const item = await inventory.getBySku(
      normalizeSku(c.req.param('sku'))
    )

    if (!item) {
      return c.json(
        { message: 'Inventory item not found' },
        404
      )
    }

    return c.json(item)
  })

  return app
}
