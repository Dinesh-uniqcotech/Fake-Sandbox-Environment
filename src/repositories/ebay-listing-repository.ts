import { prisma } from '../database/prisma'
import { EbayListing } from '../types/listing'
import { mapEbayListing } from './prisma-mappers'

export class EbayListingRepository {
  async findAll() {
    const listings = await prisma.listing.findMany({
      where: { platform: 'ebay' },
      orderBy: { createdAt: 'desc' }
    })

    return listings.map(mapEbayListing)
  }

  async findBySku(sku: string) {
    const listing = await prisma.listing.findFirst({
      where: { platform: 'ebay', sku }
    })

    return listing ? mapEbayListing(listing) : undefined
  }

  async findBySellerSku(sellerId: string, sku: string) {
    const listing = await prisma.listing.findUnique({
      where: {
        platform_sellerId_sku: {
          platform: 'ebay',
          sellerId,
          sku
        }
      }
    })

    return listing ? mapEbayListing(listing) : undefined
  }

  async findById(id: string) {
    const listing = await prisma.listing.findUnique({
      where: { id }
    })

    return listing ? mapEbayListing(listing) : undefined
  }

  async save(listing: EbayListing) {
    await this.upsertInventory(
      listing.inventorySku,
      listing.quantity ?? 0
    )

    const saved = await prisma.listing.upsert({
      where: { id: listing.id },
      create: {
        id: listing.id,
        platform: 'ebay',
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
        platform: 'ebay',
        sellerId: listing.sellerId,
        sku: listing.sku,
        inventorySku: listing.inventorySku,
        status: listing.status,
        payload: listing.payload as any,
        platformFields: this.platformFields(listing) as any,
        webhookUrl: listing.webhookUrl
      }
    })

    return mapEbayListing(saved)
  }

  async updateStatus(id: string, status: EbayListing['status']) {
    try {
      const listing = await prisma.listing.update({
        where: { id },
        data: { status }
      })

      return mapEbayListing(listing)
    } catch {
      return undefined
    }
  }

  async deleteBySku(sku: string) {
    const result = await prisma.listing.deleteMany({
      where: { platform: 'ebay', sku }
    })

    return result.count > 0
  }

  async deleteById(id: string) {
    const result = await prisma.listing.deleteMany({
      where: { id, platform: 'ebay' }
    })

    return result.count > 0
  }

  private platformFields(listing: EbayListing) {
    return {
      ...this.payloadFields(listing.payload),
      itemId: listing.itemId,
      listingType: listing.listingType,
      startPrice: listing.startPrice,
      buyItNowPrice: listing.buyItNowPrice,
      condition: listing.condition,
      quantity: listing.quantity,
      title: listing.title
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
