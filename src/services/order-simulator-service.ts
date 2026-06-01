import { EventBus } from '../events/event-bus'
import { OrderRepository } from '../repositories/order-repository'
import { PlaceOrderInput } from '../types/order'
import { WebhookService } from '../webhooks/webhook-service'

export class OrderSimulatorService {
  constructor(
    private readonly orders: OrderRepository,
    private readonly events: EventBus,
    private readonly webhooks: WebhookService
  ) {}

  findOrders() {
    return this.orders.findAll()
  }

  findListingsByPlatform(platform: string) {
    return this.orders.findListingsByPlatform(platform)
  }

  async placeOrder(input: PlaceOrderInput) {
    const result = await this.orders.placeOrder(input)

    await this.events.publish({
      event: 'ORDER_PLACED',
      resourceType: 'order',
      resourceId: result.order.id,
      payload: {
        platform: result.order.platform,
        sellerId: result.order.sellerId,
        marketplaceOrderId:
          result.order.marketplaceOrderId,
        sku: input.sku,
        quantity: input.quantity,
        inventorySku: result.inventory.sku,
        remainingQuantity: result.inventory.quantity
      }
    })

    const webhookUrl =
      input.webhookUrl ?? result.listing.webhookUrl
    let webhookDelivered = false

    if (webhookUrl) {
      const delivery = await this.webhooks.deliver(
        webhookUrl,
        {
          event: 'ORDER_PLACED',
          platform: result.order.platform,
          sellerId: result.order.sellerId,
          marketplaceOrderId:
            result.order.marketplaceOrderId,
          orderId: result.order.id,
          sku: input.sku,
          quantity: input.quantity,
          inventorySku: result.inventory.sku,
          remainingQuantity: result.inventory.quantity
        }
      )
      webhookDelivered = delivery.status === 'DELIVERED'
    }

    return {
      order: result.order,
      inventory: result.inventory,
      webhookDelivered
    }
  }
}
