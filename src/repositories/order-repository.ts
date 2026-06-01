import { randomUUID } from 'crypto'
import { prisma } from '../database/prisma'
import { PlaceOrderInput } from '../types/order'
import { mapInventoryItem, mapOrder } from './prisma-mappers'

export class OrderRepository {
  async findAll() {
    const orders = await prisma.order.findMany({
      include: { orderItems: true },
      orderBy: { createdAt: 'desc' }
    })

    return orders.map(mapOrder)
  }

  async findListingsByPlatform(platform: string) {
    return prisma.listing.findMany({
      where: { platform },
      include: { inventory: true },
      orderBy: { createdAt: 'desc' }
    })
  }

  async placeOrder(input: PlaceOrderInput) {
    return prisma.$transaction(async tx => {
      const listing = await tx.listing.findFirst({
        where: {
          platform: input.platform,
          sku: input.sku,
          ...(input.sellerId
            ? { sellerId: input.sellerId }
            : {})
        }
      })

      if (!listing) {
        throw new Error('LISTING_NOT_FOUND')
      }

      const decrement = await tx.inventoryItem.updateMany({
        where: {
          sku: listing.inventorySku,
          quantity: { gte: input.quantity }
        },
        data: {
          quantity: { decrement: input.quantity }
        }
      })

      if (decrement.count === 0) {
        throw new Error('INSUFFICIENT_INVENTORY')
      }

      const inventory = await tx.inventoryItem.findUniqueOrThrow({
        where: { sku: listing.inventorySku }
      })

      const order = await tx.order.create({
        data: {
          id: randomUUID(),
          platform: listing.platform,
          sellerId: listing.sellerId,
          marketplaceOrderId:
            input.marketplaceOrderId ?? randomUUID(),
          status: 'PLACED',
          payload: {
            ...(input.payload ?? {}),
            webhookUrl: input.webhookUrl,
            source: 'marketplace-simulator'
          } as any,
          orderedAt: new Date(),
          orderItems: {
            create: {
              id: randomUUID(),
              sku: listing.sku,
              listingId: listing.id,
              inventorySku: listing.inventorySku,
              quantity: input.quantity,
              unitPrice: input.unitPrice,
              payload: listing.platformFields as any
            }
          }
        },
        include: { orderItems: true }
      })

      return {
        order: mapOrder(order),
        inventory: mapInventoryItem(inventory),
        listing: {
          id: listing.id,
          platform: listing.platform,
          sku: listing.sku,
          sellerId: listing.sellerId,
          webhookUrl: listing.webhookUrl
        }
      }
    })
  }
}
