import { prisma } from '../database/prisma'
import {
  GenericMarketplaceListing,
  ListingStatus
} from '../types/listing'
import { mapGenericMarketplaceListing } from './prisma-mappers'

const genericPlatforms = [
  'google-shopping',
  'meta-marketplace',
  'shopify',
  'etsy',
  'tiktok-shop',
  'aliexpress',
  'rakuten',
  'shopee',
  'temu',
  'best-buy',
  'wayfair'
]

export class GenericMarketplaceListingRepository {
  async findAll() {
    const listings = await prisma.listing.findMany({
      where: { platform: { in: genericPlatforms } },
      orderBy: { createdAt: 'desc' }
    })

    return listings.map(mapGenericMarketplaceListing)
  }

  async findBySku(sku: string) {
    const listing = await prisma.listing.findFirst({
      where: { sku, platform: { in: genericPlatforms } }
    })

    return listing
      ? mapGenericMarketplaceListing(listing)
      : undefined
  }

  async findByPlatformSellerSku(
    platform: GenericMarketplaceListing['platform'],
    sellerId: string,
    sku: string
  ) {
    const listing = await prisma.listing.findUnique({
      where: {
        platform_sellerId_sku: {
          platform,
          sellerId,
          sku
        }
      }
    })

    return listing
      ? mapGenericMarketplaceListing(listing)
      : undefined
  }

  async findById(id: string) {
    const listing = await prisma.listing.findUnique({
      where: { id }
    })

    return listing
      ? mapGenericMarketplaceListing(listing)
      : undefined
  }

  async save(listing: GenericMarketplaceListing) {
    await this.upsertInventory(
      listing.inventorySku,
      listing.quantity ?? 0
    )

    const saved = await prisma.listing.upsert({
      where: { id: listing.id },
      create: {
        id: listing.id,
        platform: listing.platform,
        sellerId: listing.sellerId,
        sku: listing.sku,
        inventorySku: listing.inventorySku,
        submissionId: listing.submissionId,
        status: listing.status,
        payload: listing.payload as any,
        webhookUrl: listing.webhookUrl,
        platformFields: listing.platformFields as any
      },
      update: {
        platform: listing.platform,
        sellerId: listing.sellerId,
        sku: listing.sku,
        inventorySku: listing.inventorySku,
        status: listing.status,
        payload: listing.payload as any,
        webhookUrl: listing.webhookUrl,
        platformFields: listing.platformFields as any
      }
    })

    return mapGenericMarketplaceListing(saved)
  }

  async updateStatus(id: string, status: ListingStatus) {
    try {
      const listing = await prisma.listing.update({
        where: { id },
        data: { status }
      })

      return mapGenericMarketplaceListing(listing)
    } catch {
      return undefined
    }
  }

  async deleteBySku(sku: string) {
    const result = await prisma.listing.deleteMany({
      where: { sku, platform: { in: genericPlatforms } }
    })

    return result.count > 0
  }

  async deleteById(id: string) {
    const result = await prisma.listing.deleteMany({
      where: { id, platform: { in: genericPlatforms } }
    })

    return result.count > 0
  }

  private upsertInventory(sku: string, quantity: number) {
    return prisma.inventoryItem.upsert({
      where: { sku },
      create: { sku, quantity },
      update: { quantity }
    })
  }
}
