import { prisma } from '../database/prisma'
import { WalmartListing } from '../types/listing'
import { mapWalmartListing } from './prisma-mappers'

export class WalmartListingRepository {
  async findAll() {
    const listings = await prisma.listing.findMany({
      where: { platform: 'walmart' },
      orderBy: { createdAt: 'desc' }
    })

    return listings.map(mapWalmartListing)
  }

  async findBySku(sku: string) {
    const listing = await prisma.listing.findFirst({
      where: { platform: 'walmart', sku }
    })

    return listing ? mapWalmartListing(listing) : undefined
  }

  async findBySellerSku(sellerId: string, sku: string) {
    const listing = await prisma.listing.findUnique({
      where: {
        platform_sellerId_sku: {
          platform: 'walmart',
          sellerId,
          sku
        }
      }
    })

    return listing ? mapWalmartListing(listing) : undefined
  }

  async findById(id: string) {
    const listing = await prisma.listing.findUnique({
      where: { id }
    })

    return listing ? mapWalmartListing(listing) : undefined
  }

  async save(listing: WalmartListing) {
    await this.upsertInventory(
      listing.inventorySku,
      listing.quantity ?? 0
    )

    const saved = await prisma.listing.upsert({
      where: { id: listing.id },
      create: {
        id: listing.id,
        platform: 'walmart',
        sellerId: listing.sellerId,
        sku: listing.sku,
        inventorySku: listing.inventorySku,
        submissionId: listing.submissionId,
        status: listing.status,
        payload: listing.payload as any,
        platformFields: this.platformFields(listing) as any,
        webhookUrl: listing.webhookUrl
      },
      update: {
        platform: 'walmart',
        sellerId: listing.sellerId,
        sku: listing.sku,
        inventorySku: listing.inventorySku,
        status: listing.status,
        payload: listing.payload as any,
        platformFields: this.platformFields(listing) as any,
        webhookUrl: listing.webhookUrl
      }
    })

    return mapWalmartListing(saved)
  }

  async updateStatus(id: string, status: WalmartListing['status']) {
    try {
      const listing = await prisma.listing.update({
        where: { id },
        data: { status }
      })

      return mapWalmartListing(listing)
    } catch {
      return undefined
    }
  }

  async deleteBySku(sku: string) {
    const result = await prisma.listing.deleteMany({
      where: { platform: 'walmart', sku }
    })

    return result.count > 0
  }

  async deleteById(id: string) {
    const result = await prisma.listing.deleteMany({
      where: { id, platform: 'walmart' }
    })

    return result.count > 0
  }

  private platformFields(listing: WalmartListing) {
    return {
      ...this.payloadFields(listing.payload),
      itemId: listing.itemId,
      price: listing.price,
      quantity: listing.quantity,
      upc: listing.upc,
      mpn: listing.mpn,
      brand: listing.brand,
      shippingTemplate: listing.shippingTemplate
    }
  }

  private payloadFields(payload: unknown) {
    return typeof payload === 'object' &&
      payload !== null &&
      !Array.isArray(payload)
      ? payload
      : {}
  }

  private upsertInventory(sku: string, quantity: number) {
    return prisma.inventoryItem.upsert({
      where: { sku },
      create: { sku, quantity },
      update: { quantity }
    })
  }
}
