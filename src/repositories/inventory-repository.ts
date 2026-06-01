import { prisma } from '../database/prisma'
import { InventoryItem } from '../types/inventory'
import { mapInventoryItem } from './prisma-mappers'

export class InventoryRepository {
  async findAll(options: {
    limit?: number
    offset?: number
    below?: number
  } = {}) {
    const items = await prisma.inventoryItem.findMany({
      where:
        typeof options.below === 'number'
          ? { quantity: { lt: options.below } }
          : undefined,
      orderBy: { updatedAt: 'desc' }
      ,
      take: options.limit,
      skip: options.offset
    })

    return items.map(mapInventoryItem)
  }

  async getSummary() {
    const [totals, lowCount] = await Promise.all([
      prisma.inventoryItem.aggregate({
        _count: { sku: true },
        _sum: { quantity: true }
      }),
      prisma.inventoryItem.count({
        where: { quantity: { lt: 10 } }
      })
    ])

    return {
      totalSkus: totals._count.sku,
      totalUnits: totals._sum.quantity ?? 0,
      lowOrEmpty: lowCount
    }
  }

  async findBySku(sku: string) {
    const item = await prisma.inventoryItem.findUnique({
      where: { sku }
    })

    return item ? mapInventoryItem(item) : undefined
  }

  async upsert(item: InventoryItem) {
    const saved = await prisma.inventoryItem.upsert({
      where: {
        sku: item.sku
      },
      create: {
        sku: item.sku,
        quantity: item.quantity
      },
      update: {
        quantity: item.quantity
      }
    })

    return mapInventoryItem(saved)
  }
}
