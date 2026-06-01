import { EventBus } from '../events/event-bus'
import { InventoryRepository } from '../repositories/inventory-repository'
import { InventoryItem } from '../types/inventory'

export class InventoryService {
  constructor(
    private readonly inventory: InventoryRepository,
    private readonly events: EventBus
  ) {}

  findAll(options?: {
    limit?: number
    offset?: number
    below?: number
  }) {
    return this.inventory.findAll(options)
  }

  getSummary() {
    return this.inventory.getSummary()
  }

  getBySku(sku: string) {
    return this.inventory.findBySku(sku)
  }

  async updateQuantity(
    sku: string,
    quantity: number
  ) {
    const item = await this.inventory.upsert({
      sku,
      quantity,
      updatedAt: new Date().toISOString()
    })

    await this.events.publish({
      event: 'INVENTORY_UPDATED',
      resourceType: 'inventory',
      resourceId: sku,
      payload: item
    })

    return item
  }
}
