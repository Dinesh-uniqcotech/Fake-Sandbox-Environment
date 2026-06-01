import { prisma } from '../database/prisma'
import { Listing, ListingStatus } from '../types/listing'
import { mapListing } from './prisma-mappers'

export class ListingRepository {
  async findAll() {
    const listings = await prisma.listing.findMany({
      where: { platform: 'amazon' },
      orderBy: { createdAt: 'desc' }
    })

    return listings.map(mapListing)
  }

  async findBySku(sku: string) {
    const listing = await prisma.listing.findFirst({
      where: { platform: 'amazon', sku }
    })

    return listing ? mapListing(listing) : undefined
  }

  async findBySellerSku(sellerId: string, sku: string) {
    const listing = await prisma.listing.findUnique({
      where: {
        platform_sellerId_sku: {
          platform: 'amazon',
          sellerId,
          sku
        }
      }
    })

    return listing ? mapListing(listing) : undefined
  }

  async findById(id: string) {
    const listing = await prisma.listing.findUnique({
      where: { id }
    })

    return listing ? mapListing(listing) : undefined
  }

  async save(listing: Listing) {
    await this.upsertInventory(
      listing.inventorySku,
      this.quantityFromPayload(listing.payload)
    )

    const saved = await prisma.listing.upsert({
      where: { id: listing.id },
      create: {
        id: listing.id,
        platform: 'amazon',
        sellerId: listing.sellerId,
        sku: listing.sku,
        inventorySku: listing.inventorySku,
        submissionId: listing.submissionId,
        status: listing.status,
        payload: listing.payload as any,
        platformFields: listing.platformFields as any,
        webhookUrl: listing.webhookUrl
      },
      update: {
        platform: 'amazon',
        sellerId: listing.sellerId,
        sku: listing.sku,
        inventorySku: listing.inventorySku,
        submissionId: listing.submissionId,
        status: listing.status,
        payload: listing.payload as any,
        platformFields: listing.platformFields as any,
        webhookUrl: listing.webhookUrl
      }
    })

    return mapListing(saved)
  }

  async updateStatus(
    id: string,
    status: ListingStatus
  ) {
    try {
      const listing = await prisma.listing.update({
        where: { id },
        data: { status }
      })

      return mapListing(listing)
    } catch {
      return undefined
    }
  }

  async deleteBySku(sku: string) {
    const result = await prisma.listing.deleteMany({
      where: { platform: 'amazon', sku }
    })

    return result.count > 0
  }

  async deleteById(id: string) {
    const result = await prisma.listing.deleteMany({
      where: { id }
    })

    return result.count > 0
  }

  private quantityFromPayload(payload: unknown) {
    if (
      typeof payload === 'object' &&
      payload !== null &&
      'quantity' in payload &&
      typeof payload.quantity === 'number'
    ) {
      return payload.quantity
    }

    return 0
  }

  private upsertInventory(sku: string, quantity: number) {
    return prisma.inventoryItem.upsert({
      where: { sku },
      create: { sku, quantity },
      update: { quantity }
    })
  }
}
