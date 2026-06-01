import { Hono } from 'hono'
import { DashboardService } from '../services/dashboard-service'

const positiveIntegerQuery = (
  value: string | undefined,
  fallback: number
) => {
  const parsed = value ? Number(value) : fallback

  return Number.isInteger(parsed) && parsed >= 0
    ? parsed
    : fallback
}

export const createDashboardRouter = (
  dashboard: DashboardService
) => {
  const app = new Hono()

  app.get('/dashboard/analytics', async c =>
    c.json(await dashboard.getAnalytics())
  )

  app.get('/dashboard/events', async c =>
    c.json(await dashboard.getEvents())
  )

  app.get('/dashboard/processing-status', async c => {
    const hasPaging =
      c.req.query('limit') ||
      c.req.query('offset') ||
      c.req.query('inventorySku')

    if (!hasPaging) {
      return c.json(await dashboard.getProcessingStatus())
    }

    return c.json(
      await dashboard.getProcessingStatusPage({
        limit: positiveIntegerQuery(
          c.req.query('limit'),
          50
        ),
        offset: positiveIntegerQuery(
          c.req.query('offset'),
          0
        ),
        inventorySku: c.req.query('inventorySku')
      })
    )
  })

  app.get('/dashboard/queue-metrics', async c =>
    c.json(await dashboard.getQueueMetrics())
  )

  app.get('/dashboard/webhooks', async c =>
    c.json(await dashboard.getWebhookHistory())
  )

  return app
}
