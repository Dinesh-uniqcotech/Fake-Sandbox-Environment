export type OrderItem = {
  id: string
  orderId: string
  sku: string
  listingId?: string
  inventorySku: string
  quantity: number
  unitPrice?: number
  payload: unknown
  createdAt: string
  updatedAt: string
}

export type Order = {
  id: string
  platform: string
  sellerId: string
  marketplaceOrderId: string
  status: string
  payload: unknown
  orderItems: OrderItem[]
  orderedAt?: string
  createdAt: string
  updatedAt: string
}

export type PlaceOrderInput = {
  platform: string
  sku: string
  sellerId?: string
  quantity: number
  marketplaceOrderId?: string
  unitPrice?: number
  webhookUrl?: string
  payload?: Record<string, unknown>
}

export type PlaceOrderResult = {
  order: Order
  inventory: {
    sku: string
    quantity: number
    updatedAt: string
  }
  webhookDelivered: boolean
}
