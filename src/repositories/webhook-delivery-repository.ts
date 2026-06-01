import { AuditLogRepository } from './audit-log-repository'
import { WebhookDelivery } from '../types/webhook'

const deliveries = new Map<string, WebhookDelivery>()

export class WebhookDeliveryRepository {
  constructor(
    private readonly auditLogs: AuditLogRepository
  ) {}

  async save(delivery: WebhookDelivery) {
    const before = deliveries.get(delivery.id)
    deliveries.set(delivery.id, delivery)

    await this.auditLogs.add({
      action: 'WEBHOOK_DELIVERY_SAVED',
      resourceType: 'webhook',
      resourceId: delivery.id,
      before,
      after: delivery,
      metadata: {
        source: 'webhook-delivery',
        event: delivery.event,
        status: delivery.status,
        attempts: delivery.attempts
      }
    })

    return delivery
  }

  async findAll() {
    return Array.from(deliveries.values()).sort(
      (left, right) =>
        new Date(right.createdAt).getTime() -
        new Date(left.createdAt).getTime()
    )
  }
}
