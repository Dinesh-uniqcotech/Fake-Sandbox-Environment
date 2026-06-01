import { prisma } from '../database/prisma'
import { FlipkartListing } from '../types/listing'
import { mapFlipkartListing } from './prisma-mappers'

export class FlipkartListingRepository {
  async findAll() {
    const listings = await prisma.listing.findMany({
      where: { platform: 'flipkart' },
      orderBy: { createdAt: 'desc' }
    })

    return listings.map(mapFlipkartListing)
  }

  async findBySku(sku: string) {
    const listing = await prisma.listing.findFirst({
      where: { platform: 'flipkart', sku }
    })

    return listing ? mapFlipkartListing(listing) : undefined
  }

  async findBySellerSku(sellerId: string, sku: string) {
    const listing = await prisma.listing.findUnique({
      where: {
        platform_sellerId_sku: {
          platform: 'flipkart',
          sellerId,
          sku
        }
      }
    })

    return listing ? mapFlipkartListing(listing) : undefined
  }

  async findById(id: string) {
    const listing = await prisma.listing.findUnique({
      where: { id }
    })

    return listing ? mapFlipkartListing(listing) : undefined
  }

  async save(listing: FlipkartListing) {
    await this.upsertInventory(
      listing.inventorySku,
      listing.quantity ?? 0
    )

    const saved = await prisma.listing.upsert({
      where: { id: listing.id },
      create: {
        id: listing.id,
        platform: 'flipkart',
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
        platform: 'flipkart',
        sellerId: listing.sellerId,
        sku: listing.sku,
        inventorySku: listing.inventorySku,
        status: listing.status,
        payload: listing.payload as any,
        platformFields: this.platformFields(listing) as any,
        webhookUrl: listing.webhookUrl
      }
    })

    return mapFlipkartListing(saved)
  }

  async updateStatus(id: string, status: FlipkartListing['status']) {
    try {
      const listing = await prisma.listing.update({
        where: { id },
        data: { status }
      })

      return mapFlipkartListing(listing)
    } catch {
      return undefined
    }
  }

  async deleteBySku(sku: string) {
    const result = await prisma.listing.deleteMany({
      where: { platform: 'flipkart', sku }
    })

    return result.count > 0
  }

  async deleteById(id: string) {
    const result = await prisma.listing.deleteMany({
      where: { id, platform: 'flipkart' }
    })

    return result.count > 0
  }

  private platformFields(listing: FlipkartListing) {
    return {
      ...this.payloadFields(listing.payload),
      channelSkuId: listing.channelSkuId,
      productId: listing.productId,
      price: listing.price,
      quantity: listing.quantity,
      hsn: listing.hsn,
      gstRate: listing.gstRate,
      fulfillment: listing.fulfillment
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
