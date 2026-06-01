import { DashboardService } from './services/dashboard-service'
import { EventBus } from './events/event-bus'
import { EventRepository } from './repositories/event-repository'
import { InventoryRepository } from './repositories/inventory-repository'
import { InventoryService } from './services/inventory-service'
import { ListingRepository } from './repositories/listing-repository'
import { ListingService } from './services/listing-service'
import { FlipkartListingRepository } from './repositories/flipkart-listing-repository'
import { FlipkartListingService } from './services/flipkart-listing-service'
import { WalmartListingRepository } from './repositories/walmart-listing-repository'
import { WalmartListingService } from './services/walmart-listing-service'
import { EbayListingRepository } from './repositories/ebay-listing-repository'
import { EbayListingService } from './services/ebay-listing-service'
import { GenericMarketplaceListingRepository } from './repositories/generic-marketplace-listing-repository'
import { GenericMarketplaceListingService } from './services/generic-marketplace-listing-service'
import { MarketplaceFieldMappingRepository } from './repositories/marketplace-field-mapping-repository'
import { MarketplaceFieldMappingService } from './services/marketplace-field-mapping-service'
import { OrderRepository } from './repositories/order-repository'
import { OrderSimulatorService } from './services/order-simulator-service'
import { ListingStateMachine } from './state-machines/listing-state-machine'
import { createListingLifecycleQueue } from './queues/queue-factory'
import { RequestLogRepository } from './repositories/request-log-repository'
import { WebhookDeliveryRepository } from './repositories/webhook-delivery-repository'
import { WebhookService } from './webhooks/webhook-service'
import { AuditLogRepository } from './repositories/audit-log-repository'

const auditLogRepository = new AuditLogRepository()
const eventRepository = new EventRepository(
  auditLogRepository
)
const listingRepository = new ListingRepository()
const flipkartListingRepository =
  new FlipkartListingRepository()
const walmartListingRepository =
  new WalmartListingRepository()
const ebayListingRepository =
  new EbayListingRepository()
const genericMarketplaceListingRepository =
  new GenericMarketplaceListingRepository()
const marketplaceFieldMappingRepository =
  new MarketplaceFieldMappingRepository()
const inventoryRepository = new InventoryRepository()
const orderRepository = new OrderRepository()
const webhookDeliveryRepository =
  new WebhookDeliveryRepository(auditLogRepository)

const eventBus = new EventBus(eventRepository)
const webhookService = new WebhookService(
  webhookDeliveryRepository,
  eventBus
)
const listingLifecycleQueue =
  createListingLifecycleQueue()

export const container = {
  requestLogs: new RequestLogRepository(
    auditLogRepository
  ),
  listings: new ListingService(
    listingRepository,
    new ListingStateMachine(),
    listingLifecycleQueue,
    eventBus,
    webhookService
  ),
  flipkartListings: new FlipkartListingService(
    flipkartListingRepository,
    new ListingStateMachine(),
    listingLifecycleQueue,
    eventBus,
    webhookService
  ),
  walmartListings: new WalmartListingService(
    walmartListingRepository,
    new ListingStateMachine(),
    listingLifecycleQueue,
    eventBus,
    webhookService
  ),
  ebayListings: new EbayListingService(
    ebayListingRepository,
    new ListingStateMachine(),
    listingLifecycleQueue,
    eventBus,
    webhookService
  ),
  genericMarketplaceListings:
    new GenericMarketplaceListingService(
      genericMarketplaceListingRepository,
      new ListingStateMachine(),
      listingLifecycleQueue,
      eventBus,
      webhookService
    ),
  inventory: new InventoryService(
    inventoryRepository,
    eventBus
  ),
  marketplaceFieldMappings:
    new MarketplaceFieldMappingService(
      marketplaceFieldMappingRepository
    ),
  orderSimulator: new OrderSimulatorService(
    orderRepository,
    eventBus,
    webhookService
  ),
  dashboard: new DashboardService(
    listingRepository,
    flipkartListingRepository,
    walmartListingRepository,
    ebayListingRepository,
    genericMarketplaceListingRepository,
    inventoryRepository,
    eventRepository,
    webhookDeliveryRepository,
    listingLifecycleQueue
  )
}
