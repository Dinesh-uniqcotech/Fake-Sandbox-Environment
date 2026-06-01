export type EmulatorEventName =
  | 'LISTING_CREATED'
  | 'LISTING_VALIDATED'
  | 'LISTING_DISCOVERABLE'
  | 'INVENTORY_UPDATED'
  | 'ORDER_PLACED'
  | 'WEBHOOK_DELIVERED'
  | 'WEBHOOK_FAILED'

export type EmulatorEvent = {
  id: string
  event: EmulatorEventName
  resourceType: 'listing' | 'inventory' | 'order' | 'webhook'
  resourceId: string
  payload: Record<string, unknown>
  createdAt: string
}
