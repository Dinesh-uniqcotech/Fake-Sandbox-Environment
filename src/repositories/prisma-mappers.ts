import {
  EbayListing,
  FlipkartListing,
  GenericMarketplaceListing,
  Listing,
  WalmartListing
} from '../types/listing'
import { InventoryItem } from '../types/inventory'
import { EmulatorEvent } from '../types/events'
import { MarketplaceFieldMapping } from '../types/field-mapping'
import { WebhookDelivery } from '../types/webhook'
import { Order } from '../types/order'

const toIso = (value: Date | string) =>
  value instanceof Date ? value.toISOString() : value

const platformFields = (listing: any) =>
  typeof listing.platformFields === 'object' &&
  listing.platformFields !== null &&
  !Array.isArray(listing.platformFields)
    ? listing.platformFields
    : {}

export const mapListing = (listing: any): Listing => ({
  ...listing,
  platform: 'amazon',
  platformFields: platformFields(listing),
  createdAt: toIso(listing.createdAt),
  updatedAt: toIso(listing.updatedAt)
})

export const mapFlipkartListing = (
  listing: any
): FlipkartListing => ({
  ...listing,
  ...platformFields(listing),
  platform: 'flipkart',
  platformFields: platformFields(listing),
  createdAt: toIso(listing.createdAt),
  updatedAt: toIso(listing.updatedAt)
})

export const mapWalmartListing = (
  listing: any
): WalmartListing => ({
  ...listing,
  ...platformFields(listing),
  platform: 'walmart',
  platformFields: platformFields(listing),
  createdAt: toIso(listing.createdAt),
  updatedAt: toIso(listing.updatedAt)
})

export const mapEbayListing = (
  listing: any
): EbayListing => ({
  ...listing,
  ...platformFields(listing),
  platform: 'ebay',
  platformFields: platformFields(listing),
  createdAt: toIso(listing.createdAt),
  updatedAt: toIso(listing.updatedAt)
})

export const mapGenericMarketplaceListing = (
  listing: any
): GenericMarketplaceListing => ({
  ...listing,
  ...platformFields(listing),
  platformFields: platformFields(listing),
  createdAt: toIso(listing.createdAt),
  updatedAt: toIso(listing.updatedAt)
})

export const mapInventoryItem = (
  item: any
): InventoryItem => ({
  sku: item.sku,
  quantity: item.quantity,
  updatedAt: toIso(item.updatedAt)
})

export const mapEvent = (event: any): EmulatorEvent => ({
  ...event,
  createdAt: toIso(event.createdAt)
})

export const mapWebhookDelivery = (
  delivery: any
): WebhookDelivery => ({
  ...delivery,
  createdAt: toIso(delivery.createdAt),
  updatedAt: toIso(delivery.updatedAt)
})

const stringArray = (value: unknown) =>
  Array.isArray(value)
    ? value.filter(item => typeof item === 'string')
    : []

const stringRecord = (value: unknown) =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value)
    ? Object.fromEntries(
        Object.entries(value).filter(
          ([, item]) => typeof item === 'string'
        )
      )
    : {}

export const mapMarketplaceFieldMapping = (
  mapping: any
): MarketplaceFieldMapping => ({
  ...mapping,
  fields: stringArray(mapping.fields),
  mapping: stringRecord(mapping.mapping),
  createdAt: toIso(mapping.createdAt),
  updatedAt: toIso(mapping.updatedAt)
})

export const mapOrder = (order: any): Order => ({
  ...order,
  orderedAt: order.orderedAt
    ? toIso(order.orderedAt)
    : undefined,
  createdAt: toIso(order.createdAt),
  updatedAt: toIso(order.updatedAt),
  orderItems: Array.isArray(order.orderItems)
    ? order.orderItems.map((item: any) => ({
        ...item,
        listingId: item.listingId ?? undefined,
        unitPrice: item.unitPrice ?? undefined,
        createdAt: toIso(item.createdAt),
        updatedAt: toIso(item.updatedAt)
      }))
    : []
})
