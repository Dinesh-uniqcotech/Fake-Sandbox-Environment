type MarketplacePlatform =
  | 'flipkart'
  | 'walmart'
  | 'ebay'
  | 'google-shopping'
  | 'meta-marketplace'
  | 'shopify'
  | 'etsy'
  | 'tiktok-shop'
  | 'aliexpress'
  | 'rakuten'
  | 'shopee'
  | 'temu'
  | 'best-buy'
  | 'wayfair'

type ListingPlatform = 'amazon' | MarketplacePlatform

type AnalyticsResponse = {
  listings: {
    total: number
    byStatus: Record<string, number>
    byPlatform?: Record<ListingPlatform, number>
  }
  inventory?: {
    total: number
    byPlatform: Record<ListingPlatform, number>
  }
  webhooks: {
    totalDeliveries: number
    byPlatform?: Record<ListingPlatform, number>
  }
}

type Listing = {
  id: string
  platform: ListingPlatform
  sellerId: string
  sku: string
  inventorySku?: string
  status: string
  createdAt: string
}

type SimulatorListing = Listing & {
  webhookUrl?: string
  inventory?: InventoryItem
}

type AuditEvent = {
  event: string
  resourceType: string
  resourceId: string
  createdAt: string
}

type QueueMetrics = {
  driver: string
  waiting: number
  delayed: number
  active: number
  completed: number
  failed: number
  deadLettered: number
}

type WebhookDelivery = {
  platform: MarketplacePlatform | 'legacy'
  event: string
  status: string
  attempts: number
  url: string
  updatedAt: string
}

type InventoryItem = {
  sku: string
  quantity: number
  updatedAt: string
}

type InventorySummary = {
  totalSkus: number
  totalUnits: number
  lowOrEmpty: number
}

type PlaceOrderResult = {
  order: {
    id: string
    marketplaceOrderId: string
  }
  inventory: InventoryItem
  webhookDelivered: boolean
}

type OrderRecord = {
  id: string
  platform: ListingPlatform
  sellerId: string
  marketplaceOrderId: string
  status: string
  orderItems: Array<{
    sku: string
    inventorySku: string
    quantity: number
  }>
  createdAt: string
}

type ApiOptions = RequestInit & {
  headers?: Record<string, string>
}

const platformLabels: Record<ListingPlatform, string> = {
  amazon: 'Amazon',
  flipkart: 'Flipkart',
  walmart: 'Walmart',
  ebay: 'eBay',
  'google-shopping': 'Google Shopping',
  'meta-marketplace': 'Meta Marketplace',
  shopify: 'Shopify',
  etsy: 'Etsy',
  'tiktok-shop': 'TikTok Shop',
  aliexpress: 'AliExpress',
  rakuten: 'Rakuten',
  shopee: 'Shopee',
  temu: 'Temu',
  'best-buy': 'Best Buy',
  wayfair: 'Wayfair'
}

const marketplacePlatforms: MarketplacePlatform[] = [
  'flipkart',
  'walmart',
  'ebay',
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

const listingPlatforms: ListingPlatform[] = [
  'amazon',
  ...marketplacePlatforms
]

const uniqueFields = (fields: string[]) =>
  Array.from(new Set(fields))

const amazonEbayFields = uniqueFields([
  'Item Name',
  'Brand Name',
  'External Product ID',
  'Item Type Keyword',
  'Model Number',
  'Model Name',
  'Manufacturer',
  'Product Description',
  'Bullet Point',
  'Generic Keyword',
  'Special Features',
  'Style',
  'Age Range Description',
  'Material',
  'Fabric Type',
  'Number of Items',
  'Item Package Quantity',
  'Color',
  'Size',
  'Part Number',
  'Item Shape',
  'Care Instructions',
  'Arm Height',
  'Arm Height Unit',
  'Arm Style',
  'Frame Material',
  'Surface Recommendation',
  'Required Assembly',
  'Fill Material',
  'Assembly Instructions',
  'Form Factor',
  'Furniture Finish',
  'Pattern',
  'Finish Type',
  'Unit Count',
  'Unit type',
  'Included Components',
  'Recommended Uses For Product',
  'Back Style',
  'Cushion Style',
  'Room Type',
  'Seat Back Interior Height',
  'Seat Back Interior Height Unit',
  'Seat Depth',
  'Seat Depth Unit',
  'Seat Height',
  'Seat Height Unit',
  'Seat Length',
  'Seat Length Unit',
  'Seat Material',
  'Maximum Weight Recommendation',
  'Maximum Weight Recommendation Unit',
  'Number of Height Positions',
  'Leg Style',
  'Seat Recliner Operating Mechanism',
  'Seat Recliner Operation Mode',
  'Upholstery Fabric Type',
  'Indoor Outdoor Usage',
  'Furniture Base Movement',
  'Item Depth Front To Back',
  'Item depth Unit',
  'Item Height Floor To Top',
  'Item Height Unit of Measure',
  'Item Width Side To Side',
  'Item Width Unit',
  'Reclining Position Count',
  'Chair Backrest Width',
  'Chair Backrest Width Unit',
  'Assembly Instructions Description',
  'SKU',
  'Product Type',
  'Quantity',
  'Handling time',
  'Your Price',
  'Minimum Seller Allowed Price',
  'Maximum Seller Allowed Price',
  'Sale Price',
  'Sale Start Date',
  'Sale End Date',
  'Item Condition',
  'List Price',
  'Product Tax Code',
  'Shipping Template',
  'Maximum Order Quantity',
  'Item Length',
  'Item Length Unit',
  'Item Package Length',
  'Package Length Unit',
  'Item Package Width',
  'Package Width Unit',
  'Item Package Height',
  'Package Height Unit',
  'Package Weight',
  'Package Weight Unit'
])

const walmartExcelFields = uniqueFields([
  'SKU',
  'Spec Product Type',
  'Product ID Type',
  'Product ID',
  'Product Name',
  'Brand Name',
  'Selling Price',
  'Shipping Weight (lbs)',
  'Country of Origin - Substantial Transformation',
  'Fulfillment Center ID',
  'Inventory Quantity',
  'Pre Order Available On',
  'Site Description',
  'Key Features (+)',
  'Key Features 1 (+)',
  'Key Features 2 (+)',
  'Is Prop 65 Warning Required',
  'Age Group (+)',
  'Measure',
  'Unit',
  'Color',
  'Color Category (+)',
  'Condition',
  'Desk Chair Type',
  'Has Written Warranty',
  'Is Assembly Required',
  'Material (+)',
  'Small Parts Warning Code (+)',
  'Upholstered',
  'Additional Features (+)',
  'Arm Style',
  'Assembly Instructions URL',
  'Base Style',
  'California Prop 65 Warning Text',
  'Certification Type',
  'Children Product Certificate Document Reference ID',
  'Children Product Test Report Document Reference ID',
  'Cleaning, Care & Maintenance',
  'Collection',
  'Count Per Pack',
  'Fabric Material Percentage',
  'Fabric Material Name',
  'Fill Material (+)',
  'Frame Color',
  'Frame Material (+)',
  'Gender',
  'General Certificate of Conformity Document Reference ID',
  'Home Decor Style (+)',
  'Inflex Kit Component',
  'Items Included (+)',
  'Law Label Registration Number',
  'Law Label Identification Provider',
  'Manufacturer Name',
  'Manufacturer Part Number',
  'Model Number',
  'Multipack Quantity',
  'Net Content Statement',
  'Number of Pieces',
  'Occasion (+)',
  'Pattern (+)',
  'Product Line (+)',
  'Recommended Locations (+)',
  'Recommended Use (+)',
  'Restored Product ID',
  'Restored Product ID Type',
  'Seat Back Height Descriptor',
  'Seat Color (+)',
  'Seat Material (+)',
  'Seating Capacity',
  'Sports League (+)',
  'Sports Team (+)',
  'Suggested Number of People for Assembly',
  'Third Party Accreditation Symbol on Product Package Code (+)',
  'Total Count',
  'Warranty Text',
  'Warranty URL',
  'Variant Group ID',
  'Variant Attribute Names (+)',
  'Is Primary Variant',
  'Swatch Variant Attribute',
  'Swatch Image URL',
  'ZIP Codes',
  'States',
  'State Restrictions Reason',
  'Product is or Contains an Electronic Component?',
  'Product is or Contains a Chemical, Aerosol or Pesticide?',
  'Product is or Contains this Battery Type',
  'Fulfillment Lag Time',
  'Ships in Original Packaging',
  'Must ship alone?',
  'Is Preorder',
  'Release Date',
  'Site Start Date',
  'Site End Date',
  'External Product ID Type',
  'External Product ID',
  'Product Id Update',
  'SKU Update',
  'MSRP',
  'Maximum Seller Allowed Price',
  'Minimum Seller Allowed Price',
  'Repricer Strategy',
  'Product Package Weight (lbs)',
  'Product Package Dimensions Depth (in)',
  'Product Package Dimensions Width (in)',
  'Product Package Dimensions Height (in)'
])

const shopifyExcelFields = uniqueFields([
  'Title',
  'Description',
  'Color',
  'Material',
  'Max Recommended Weight',
  'Chair Weight',
  'Dimensions',
  'Ergonomic options',
  'Service Paragraph 1',
  'Service Paragraph 2',
  'Customer love badges',
  'Product Model'
])

const flipkartExcelFields = uniqueFields([
  'Seller SKU ID',
  'Group ID',
  'Listing Status',
  'MRP (INR)',
  'Your selling price (INR)',
  'Fullfilment by',
  'Procurement type',
  'Procurement SLA (DAY)',
  'Stock',
  'Shipping provider',
  'Local handling fee (INR)',
  'Zonal handling fee (INR)',
  'National handling fee (INR)',
  'Length (CM)',
  'Breadth (CM)',
  'Height (CM)',
  'Weight (KG)',
  'HSN',
  'Country Of Origin',
  'Manufacturer Details',
  'Packer Details',
  'Importer Details',
  'Tax Code',
  'Brand',
  'Model Number',
  'Frame Material Subtype',
  'Frame Material',
  'Upholstery Included',
  'Upholstery Material',
  'Upholstery Type',
  'Type',
  'Chair Features',
  'Suitable For',
  'Delivery Condition',
  'Items Included',
  'Width (cm)',
  'Height (cm)',
  'Depth (cm)',
  'Warranty Summary',
  'Covered in Warranty',
  'Not Covered in Warranty',
  'Color',
  'Set of',
  'Weight (kg)',
  'Care Instructions',
  'Warranty Service Type',
  'Video URL',
  'Model Series Name',
  'Back Height',
  'Bush Included',
  'Bend Direction',
  'Accessories Included',
  'Origin of Manufacture',
  'Ergonomic',
  'Domestic Warranty',
  'Domestic Warranty - Measuring Unit',
  'Description',
  'Search Keywords',
  'Key Features',
  'Finish Type',
  'Seat Width (cm)',
  'Seat Height (cm)',
  'Seat Depth (cm)',
  'EAN/UPC',
  'Model Name',
  'Supplier Image'
])

const bestBuyExcelFields = uniqueFields([
  'Shop sku',
  'Title BB (EN)',
  'Short Description BB (EN)',
  'Brand Name',
  'Primary UPC',
  'Model Number',
  "Manufacturer's Part Number",
  'Long Description BB (EN)',
  'Refurbished',
  'Open Box',
  'Title BB (FR)',
  'Short Description BB (FR)',
  'Long Description BB (FR)',
  'Offer SKU',
  'Product ID',
  'Product ID Type',
  'Offer Description',
  'Offer Internal Description',
  'Offer Price',
  'Offer Price Additional Info',
  'Offer Quantity',
  'Minimum Quantity Alert',
  'Offer State',
  'Availability Start Date',
  'Availability End Date',
  'Logistic Class',
  'Discount Price',
  'Discount Start Date',
  'Discount End Date',
  'Warranty - Parts & Labour'
])

const wayfairExcelFields = uniqueFields([
  'Supplier Part Number',
  'Amazon Seller SKU',
  'Brand',
  'Manufacturer Part Number',
  'Universal Product Code',
  'Product Name',
  'Collection Name',
  'Manufacturer Product URL',
  'Variant Type',
  'Group Reference ID',
  'Variant Grouping 1',
  'Variant Attribute Name On Site 1',
  'Variant Grouping 2',
  'Variant Attribute Name On Site 2',
  'Variant Grouping 3',
  'Variant Attribute Name On Site 3',
  'Base Cost',
  'Minimum Advertised Price',
  'Manufacturer Suggested Retail Price',
  'Everyday B2B Discount Rate',
  'Marketing Copy',
  'Feature Bullet 1',
  'Feature Bullet 2',
  'Feature Bullet 3',
  'Feature Bullet 4',
  'Feature Bullet 5',
  'Minimum Order Quantity',
  'Force Quantity Multiplier',
  'Display Set Quantity',
  'Product Weight',
  'Ship Type',
  'Freight Class',
  'Lead Time',
  'Replacement Lead Time',
  'National Motor Freight Class',
  'Flat Pack',
  'Ship Palletized',
  'Carton Weight 1',
  'Carton Height 1',
  'Carton Width 1',
  'Carton Depth 1',
  'Product Type',
  'Frame Material',
  'Seat Material',
  'Upholstered',
  'Upholstery Material',
  'Back Material',
  'Back Upholstery Material',
  'Compatible Floor Type',
  'Stackable',
  'Supplier Intended and Approved Use',
  'Country of Origin - Additional Details',
  'Battery or Batteries Included',
  'Battery Composition',
  'Battery Type',
  'Number of Batteries',
  'Battery Shipment',
  'Lithium Content',
  'Watt Rating of Cells / Battery',
  'Weight of Cells / Battery',
  'Weight Capacity',
  'Product Care',
  'Seat Color',
  'Arm Material',
  'Upholstery Fill Material',
  'Frame Color / Finish',
  'Wood Species',
  'Arm Type',
  'Durability',
  'Tilt Mechanism Type',
  'Pieces Included',
  'Rub Count',
  'Detailing',
  'General Features',
  'Construction Features',
  'Built-In Features',
  'Fill Material',
  'Adjustability Features',
  'Modes / Functions',
  'Removable Components',
  'Overall Height - Top to Bottom',
  'Overall Width - Side to Side',
  'Overall Depth - Front to Back',
  'Seat Height - Floor to Seat',
  'Seat Width - Side to Side',
  'Seat Depth - Front to Back',
  'Minimum Seat Height - Floor to Seat',
  'Maximum Seat Height - Floor to Seat',
  'Seat Cushion Thickness',
  'Chair Back Height - Seat to Top of Back',
  'Overall Product Weight',
  'Assembly Required',
  'Level of Assembly',
  'Additional Tools Required (Not Included)',
  'Commercial Warranty',
  'Commercial Warranty Length',
  'Product Warranty',
  'Full or Limited Warranty',
  'Country Of Manufacturer'
])

const fieldSets: Record<ListingPlatform, string[]> = {
  amazon: amazonEbayFields,
  ebay: amazonEbayFields,
  walmart: walmartExcelFields,
  shopify: shopifyExcelFields,
  flipkart: flipkartExcelFields,
  'best-buy': bestBuyExcelFields,
  wayfair: wayfairExcelFields,
  'google-shopping': [
    'offerId',
    'googleProductCategory',
    'targetCountry',
    'contentLanguage',
    'condition',
    'availability'
  ],
  'meta-marketplace': [
    'facebookCategoryId',
    'listingType',
    'condition',
    'location',
    'availability'
  ],
  etsy: [
    'taxonomyId',
    'whoMade',
    'whenMade',
    'isSupply',
    'shippingProfileId'
  ],
  'tiktok-shop': [
    'productCategoryId',
    'warehouseId',
    'packageWeight',
    'packageDimensions',
    'sellerSku'
  ],
  aliexpress: [
    'productGroupId',
    'logisticsTemplateId',
    'servicePolicyId',
    'categoryId',
    'shippingFrom'
  ],
  rakuten: [
    'shopSku',
    'genreId',
    'warehouseId',
    'deliverySetId',
    'pointRate'
  ],
  shopee: [
    'itemSku',
    'categoryId',
    'logisticsChannelId',
    'condition',
    'weight'
  ],
  temu: [
    'goodsName',
    'categoryId',
    'warehouseRegion',
    'fulfillmentType',
    'manufacturerCode'
  ]
}

const coreFieldAliases: Record<ListingPlatform, string[]> = {
  amazon: [
    'Item Name',
    'Brand Name',
    'SKU',
    'Product Type',
    'Quantity',
    'Your Price'
  ],
  ebay: [
    'Item Name',
    'Brand Name',
    'SKU',
    'Product Type',
    'Quantity',
    'Your Price'
  ],
  walmart: [
    'SKU',
    'Product Name',
    'Brand Name',
    'Selling Price',
    'Inventory Quantity'
  ],
  shopify: ['Title', 'Description'],
  flipkart: [
    'Seller SKU ID',
    'Brand',
    'Stock',
    'Your selling price (INR)'
  ],
  'best-buy': [
    'Shop sku',
    'Title BB (EN)',
    'Brand Name',
    'Offer SKU',
    'Offer Price',
    'Offer Quantity'
  ],
  wayfair: [
    'Supplier Part Number',
    'Amazon Seller SKU',
    'Brand',
    'Product Name'
  ],
  'google-shopping': [],
  'meta-marketplace': [],
  etsy: [],
  'tiktok-shop': ['sellerSku'],
  aliexpress: [],
  rakuten: ['shopSku'],
  shopee: ['itemSku'],
  temu: ['goodsName']
}

const corePayloadForPlatform = (
  platform: ListingPlatform,
  input: {
    sku: string
    inventorySku: string
    title: string
    brand: string
    price?: number
    quantity?: number
  }
) => {
  const price = input.price
  const quantity = input.quantity
  const common = {
    productType: 'GENERAL',
    title: input.title,
    brand: input.brand,
    inventorySku: input.inventorySku
  }

  if (platform === 'amazon' || platform === 'ebay') {
    return {
      ...common,
      'Item Name': input.title,
      'Brand Name': input.brand,
      SKU: input.sku,
      'Product Type': 'GENERAL',
      ...(quantity ? { Quantity: quantity } : {}),
      ...(price ? { 'Your Price': price } : {})
    }
  }

  if (platform === 'walmart') {
    return {
      ...common,
      SKU: input.sku,
      'Product Name': input.title,
      'Brand Name': input.brand,
      ...(price ? { 'Selling Price': price } : {}),
      ...(quantity ? { 'Inventory Quantity': quantity } : {})
    }
  }

  if (platform === 'flipkart') {
    return {
      ...common,
      'Seller SKU ID': input.sku,
      Brand: input.brand,
      ...(price ? { 'Your selling price (INR)': price } : {}),
      ...(quantity ? { Stock: quantity } : {})
    }
  }

  if (platform === 'shopify') {
    return {
      ...common,
      Title: input.title,
      Description: input.title
    }
  }

  if (platform === 'best-buy') {
    return {
      ...common,
      'Shop sku': input.sku,
      'Offer SKU': input.sku,
      'Title BB (EN)': input.title,
      'Brand Name': input.brand,
      ...(price ? { 'Offer Price': price } : {}),
      ...(quantity ? { 'Offer Quantity': quantity } : {})
    }
  }

  if (platform === 'wayfair') {
    return {
      ...common,
      'Supplier Part Number': input.sku,
      'Amazon Seller SKU': input.inventorySku,
      Brand: input.brand,
      'Product Name': input.title
    }
  }

  return common
}

const mustFind = <T extends Element>(selector: string) => {
  const element = document.querySelector<T>(selector)

  if (!element) {
    throw new Error(`Missing frontend element: ${selector}`)
  }

  return element
}

const state: {
  token: string
  refreshTimer?: number
  toastTimer?: number
  listings: Listing[]
  orders: OrderRecord[]
} = {
  token: 'fake-token',
  listings: [],
  orders: []
}

const els = {
  refreshButton:
    mustFind<HTMLButtonElement>('#refreshButton'),
  toast: mustFind<HTMLElement>('#toast'),
  navButtons:
    document.querySelectorAll<HTMLButtonElement>('.nav-button'),
  panels:
    document.querySelectorAll<HTMLElement>('.tab-panel'),
  metricTotalListings:
    mustFind<HTMLElement>('#metricTotalListings'),
  metricDiscoverable:
    mustFind<HTMLElement>('#metricDiscoverable'),
  metricInventoryItems:
    mustFind<HTMLElement>('#metricInventoryItems'),
  metricWebhookDeliveries:
    mustFind<HTMLElement>('#metricWebhookDeliveries'),
  platformSummary:
    mustFind<HTMLElement>('#platformSummary'),
  queueDriver: mustFind<HTMLElement>('#queueDriver'),
  queueMetrics: mustFind<HTMLElement>('#queueMetrics'),
  recentEvents: mustFind<HTMLElement>('#recentEvents'),
  listingsTable:
    mustFind<HTMLTableSectionElement>('#listingsTable'),
  listingForm: mustFind<HTMLFormElement>('#listingForm'),
  platformSelect:
    mustFind<HTMLSelectElement>('#platformSelect'),
  marketplaceFields:
    mustFind<HTMLElement>('#marketplaceFields'),
  fieldSearch:
    mustFind<HTMLInputElement>('#fieldSearch'),
  fieldSearchButton:
    mustFind<HTMLButtonElement>('#fieldSearchButton'),
  clearFieldsButton:
    mustFind<HTMLButtonElement>('#clearFieldsButton'),
  summaryButton:
    mustFind<HTMLButtonElement>('#summaryButton'),
  summaryModal:
    mustFind<HTMLElement>('#summaryModal'),
  summaryCloseButton:
    mustFind<HTMLButtonElement>('#summaryCloseButton'),
  payloadPreview: mustFind<HTMLElement>('#payloadPreview'),
  inventoryForm:
    mustFind<HTMLFormElement>('#inventoryForm'),
  inventoryLookupSku:
    mustFind<HTMLInputElement>('#inventoryLookupSku'),
  inventoryLookupButton:
    mustFind<HTMLButtonElement>('#inventoryLookupButton'),
  inventoryResult:
    mustFind<HTMLElement>('#inventoryResult'),
  inventoryTotalCount:
    mustFind<HTMLElement>('#inventoryTotalCount'),
  inventoryTotalUnits:
    mustFind<HTMLElement>('#inventoryTotalUnits'),
  inventoryLowCount:
    mustFind<HTMLElement>('#inventoryLowCount'),
  inventoryTable:
    mustFind<HTMLTableSectionElement>('#inventoryTable'),
  simulatorForm:
    mustFind<HTMLFormElement>('#simulatorForm'),
  simulatorPlatformSelect:
    mustFind<HTMLSelectElement>('#simulatorPlatformSelect'),
  simulatorSkuSelect:
    mustFind<HTMLSelectElement>('#simulatorSkuSelect'),
  simulatorListingsTable:
    mustFind<HTMLTableSectionElement>('#simulatorListingsTable'),
  eventLog: mustFind<HTMLElement>('#eventLog'),
  webhooksTable:
    mustFind<HTMLTableSectionElement>('#webhooksTable')
}

const api = async <T>(
  path: string,
  options: ApiOptions = {}
): Promise<T> => {
  const response = await fetch(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${state.token}`,
      ...(options.headers || {})
    }
  })

  const text = await response.text()
  const contentType = response.headers.get('content-type') || ''
  const data =
    text && contentType.includes('application/json')
      ? JSON.parse(text)
      : text

  if (!response.ok) {
    throw new Error(
      typeof data === 'object' && data && 'message' in data
        ? String(data.message)
        : text || `HTTP ${response.status}`
    )
  }

  return data as T
}

const toast = (message: string) => {
  els.toast.textContent = message
  els.toast.classList.add('is-visible')
  window.clearTimeout(state.toastTimer)
  state.toastTimer = window.setTimeout(() => {
    els.toast.classList.remove('is-visible')
  }, 2600)
}

const formatDate = (value?: string) => {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value))
}

const statusClass = (value: string) =>
  value.toLowerCase()

const createListingApiPath = (
  platform: ListingPlatform,
  sellerId: string,
  sku: string
) => {
  const encodedSellerId = encodeURIComponent(sellerId)
  const encodedSku = encodeURIComponent(sku)

  return platform === 'amazon'
    ? `/listings/2021-08-01/items/${encodedSellerId}/${encodedSku}`
    : `/${platform}/items/${encodedSellerId}/${encodedSku}`
}

const listingApiBase = (platform: ListingPlatform) =>
  platform === 'amazon' ? '/listings' : `/${platform}/listings`

const parseFieldValue = (value: string) => {
  const trimmed = value.trim()

  if (!trimmed) {
    return undefined
  }

  if (trimmed === 'true') {
    return true
  }

  if (trimmed === 'false') {
    return false
  }

  const numeric = Number(trimmed)

  if (
    Number.isFinite(numeric) &&
    /^-?\d+(\.\d+)?$/.test(trimmed)
  ) {
    return numeric
  }

  if (trimmed.includes('|')) {
    return trimmed
      .split('|')
      .map(item => item.trim())
      .filter(Boolean)
  }

  return trimmed
}

const friendlyFieldLabel = (field: string) =>
  field
    .replace(/\(\+\)/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const escapeAttribute = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const fieldClues: Record<string, string> = {
  SKU: 'Enter your marketplace SKU',
  'Seller SKU ID': 'Enter the Flipkart seller SKU',
  'Shop sku': 'Enter the Best Buy shop SKU',
  'Offer SKU': 'Enter the offer SKU used for selling stock',
  'Supplier Part Number': 'Enter the supplier part number',
  'Amazon Seller SKU': 'Enter the linked Amazon seller SKU',
  Title: 'Enter the product title customers will see',
  'Item Name': 'Enter the product title customers will see',
  'Product Name': 'Enter the product title customers will see',
  'Title BB (EN)': 'Enter the English product title',
  'Title BB (FR)': 'Enter the French product title',
  Description: 'Enter a clear product description',
  'Product Description': 'Enter a clear product description',
  'Site Description': 'Enter the Walmart site description',
  'Long Description BB (EN)': 'Enter the full English product description',
  'Long Description BB (FR)': 'Enter the full French product description',
  'Short Description BB (EN)': 'Enter a short English product description',
  'Short Description BB (FR)': 'Enter a short French product description',
  'Marketing Copy': 'Enter customer-facing marketing copy',
  Brand: 'Enter the brand name',
  'Brand Name': 'Enter the brand name',
  'Manufacturer Name': 'Enter the manufacturer name',
  Manufacturer: 'Enter the manufacturer name',
  'Manufacturer Details': 'Enter manufacturer name and address details',
  'Packer Details': 'Enter packer name and address details',
  'Importer Details': 'Enter importer name and address details',
  'Model Number': 'Enter the manufacturer model number',
  'Model Name': 'Enter the model name',
  'Product Type': 'Enter the product type or category',
  'Spec Product Type': 'Enter Walmart product type',
  'Item Type Keyword': 'Enter the product keyword/category',
  'External Product ID': 'Enter UPC/EAN/GTIN or marketplace product ID',
  'Product ID': 'Enter the product identifier',
  'Product ID Type': 'Enter UPC, EAN, GTIN, ISBN, or similar',
  'Primary UPC': 'Enter the primary UPC',
  'Universal Product Code': 'Enter the UPC',
  'EAN/UPC': 'Enter EAN or UPC',
  HSN: 'Enter the HSN tax code',
  'Tax Code': 'Enter the tax code',
  'Product Tax Code': 'Enter the marketplace product tax code',
  Color: 'Enter the color',
  'Color Category (+)': 'Enter color category',
  'Frame Color': 'Enter frame color',
  'Seat Color (+)': 'Enter seat color',
  'Seat Color': 'Enter seat color',
  Material: 'Enter the main material',
  'Material (+)': 'Enter one material value',
  'Frame Material': 'Enter frame material',
  'Frame Material (+)': 'Enter frame material',
  'Seat Material': 'Enter seat material',
  'Seat Material (+)': 'Enter seat material',
  Quantity: 'Enter available quantity',
  'Inventory Quantity': 'Enter available inventory quantity',
  Stock: 'Enter available stock quantity',
  'Offer Quantity': 'Enter available offer quantity',
  'Maximum Order Quantity': 'Enter maximum units allowed per order',
  'Minimum Order Quantity': 'Enter minimum units allowed per order',
  'Your Price': 'Enter selling price',
  'Selling Price': 'Enter selling price',
  'Your selling price (INR)': 'Enter selling price in INR',
  'Offer Price': 'Enter offer price',
  'Sale Price': 'Enter sale price',
  'Discount Price': 'Enter discount price',
  MSRP: 'Enter MSRP',
  'List Price': 'Enter list price',
  MRP: 'Enter MRP',
  'MRP (INR)': 'Enter MRP in INR',
  'Base Cost': 'Enter base cost',
  'Minimum Advertised Price': 'Enter MAP price',
  'Manufacturer Suggested Retail Price': 'Enter suggested retail price',
  'Minimum Seller Allowed Price': 'Enter minimum allowed seller price',
  'Maximum Seller Allowed Price': 'Enter maximum allowed seller price',
  'Package Weight': 'Enter package weight',
  'Package Weight Unit': 'Enter unit, for example lb, kg, oz, or g',
  'Shipping Weight (lbs)': 'Enter shipping weight in pounds',
  'Product Package Weight (lbs)': 'Enter package weight in pounds',
  'Weight (KG)': 'Enter weight in kilograms',
  'Weight (kg)': 'Enter weight in kilograms',
  'Product Weight': 'Enter product weight',
  'Overall Product Weight': 'Enter total product weight',
  'Item Length': 'Enter item length',
  'Item Width Side To Side': 'Enter item width',
  'Item Height Floor To Top': 'Enter item height',
  'Length (CM)': 'Enter length in centimeters',
  'Breadth (CM)': 'Enter breadth in centimeters',
  'Height (CM)': 'Enter height in centimeters',
  'Width (cm)': 'Enter width in centimeters',
  'Height (cm)': 'Enter height in centimeters',
  'Depth (cm)': 'Enter depth in centimeters',
  Dimensions: 'Enter product dimensions',
  'Package Length Unit': 'Enter package length unit',
  'Package Width Unit': 'Enter package width unit',
  'Package Height Unit': 'Enter package height unit',
  'Item Length Unit': 'Enter item length unit',
  'Item Width Unit': 'Enter item width unit',
  'Item Height Unit of Measure': 'Enter item height unit',
  'Sale Start Date': 'Enter date as YYYY-MM-DD',
  'Sale End Date': 'Enter date as YYYY-MM-DD',
  'Availability Start Date': 'Enter date as YYYY-MM-DD',
  'Availability End Date': 'Enter date as YYYY-MM-DD',
  'Release Date': 'Enter date as YYYY-MM-DD',
  'Site Start Date': 'Enter date as YYYY-MM-DD',
  'Site End Date': 'Enter date as YYYY-MM-DD',
  'Pre Order Available On': 'Enter date as YYYY-MM-DD',
  'Supplier Image': 'Enter image URL',
  'Swatch Image URL': 'Enter swatch image URL',
  'Video URL': 'Enter product video URL',
  'Warranty URL': 'Enter warranty URL',
  'Manufacturer Product URL': 'Enter manufacturer product URL',
  'Assembly Instructions URL': 'Enter assembly instructions URL',
  'Bullet Point': 'Enter bullet points separated with |',
  'Key Features': 'Enter key features separated with |',
  'Key Features (+)': 'Enter one key feature',
  'Key Features 1 (+)': 'Enter first key feature',
  'Key Features 2 (+)': 'Enter second key feature',
  'Feature Bullet 1': 'Enter first feature bullet',
  'Feature Bullet 2': 'Enter second feature bullet',
  'Feature Bullet 3': 'Enter third feature bullet',
  'Feature Bullet 4': 'Enter fourth feature bullet',
  'Feature Bullet 5': 'Enter fifth feature bullet',
  'Generic Keyword': 'Enter search keywords separated with |',
  'Search Keywords': 'Enter search keywords separated with |',
  'Shipping Template': 'Enter marketplace shipping template name',
  'Shipping provider': 'Enter shipping provider',
  'Fulfillment Center ID': 'Enter fulfillment center ID',
  'Fullfilment by': 'Enter seller or marketplace fulfillment',
  'Procurement type': 'Enter procurement type',
  'Country Of Origin': 'Enter country of origin',
  'Country Of Manufacturer': 'Enter country of manufacturer',
  'Country of Origin - Substantial Transformation': 'Enter country of origin',
  Condition: 'Enter item condition',
  'Item Condition': 'Enter item condition',
  'Listing Status': 'Enter listing status',
  'Offer State': 'Enter offer state'
}

const placeholderForField = (platform: ListingPlatform, field: string) => {
  const exact = fieldClues[field]

  if (exact) {
    return exact
  }

  const normalized = field.toLowerCase()

  if (normalized.includes('date')) {
    return 'Enter date as YYYY-MM-DD'
  }

  if (normalized.includes('url')) {
    return 'Enter a valid URL'
  }

  if (normalized.includes('image')) {
    return 'Enter image URL'
  }

  if (
    normalized.includes('price') ||
    normalized.includes('cost') ||
    normalized.includes('fee') ||
    normalized.includes('discount') ||
    normalized.includes('rate')
  ) {
    return 'Enter numeric amount'
  }

  if (
    normalized.includes('quantity') ||
    normalized.includes('count') ||
    normalized.includes('stock') ||
    normalized.includes('capacity')
  ) {
    return 'Enter number'
  }

  if (
    normalized.includes('weight') ||
    normalized.includes('height') ||
    normalized.includes('width') ||
    normalized.includes('length') ||
    normalized.includes('depth')
  ) {
    return 'Enter numeric measurement'
  }

  if (normalized.includes('unit')) {
    return 'Enter unit of measure'
  }

  if (
    normalized.includes('description') ||
    normalized.includes('copy') ||
    normalized.includes('paragraph') ||
    normalized.includes('instructions') ||
    normalized.includes('warranty')
  ) {
    return 'Enter descriptive text'
  }

  if (
    normalized.includes('id') ||
    normalized.includes('sku') ||
    normalized.includes('code') ||
    normalized.includes('number')
  ) {
    return 'Enter identifier'
  }

  return `Enter ${platformLabels[platform]} ${friendlyFieldLabel(field).toLowerCase()}`
}

const collectMarketplaceFields = () => {
  const fields: Record<string, unknown> = {}

  els.marketplaceFields
    .querySelectorAll<HTMLInputElement>('[data-field]')
    .forEach(input => {
      const value = parseFieldValue(input.value)

      if (value !== undefined) {
        fields[input.dataset.field || input.name] = value
      }
    })

  return fields
}

const firstTextValue = (
  fields: Record<string, unknown>,
  keys: string[],
  fallback = ''
) => {
  for (const key of keys) {
    const value = fields[key]

    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value)
    }
  }

  return fallback
}

const firstNumberValue = (
  fields: Record<string, unknown>,
  keys: string[]
) => {
  for (const key of keys) {
    const value = fields[key]

    if (typeof value === 'number' && Number.isFinite(value)) {
      return value
    }

    if (typeof value === 'string') {
      const numeric = Number(value)

      if (Number.isFinite(numeric)) {
        return numeric
      }
    }
  }

  return undefined
}

const coreInputFromMarketplaceFields = (
  platform: ListingPlatform,
  fields: Record<string, unknown>
) => {
  if (platform === 'amazon' || platform === 'ebay') {
    return {
      sku: firstTextValue(fields, ['SKU']),
      title: firstTextValue(fields, ['Item Name'], 'Untitled listing'),
      brand: firstTextValue(fields, ['Brand Name'], 'Unknown brand'),
      price: firstNumberValue(fields, ['Your Price']),
      quantity: firstNumberValue(fields, ['Quantity'])
    }
  }

  if (platform === 'walmart') {
    return {
      sku: firstTextValue(fields, ['SKU']),
      title: firstTextValue(fields, ['Product Name'], 'Untitled listing'),
      brand: firstTextValue(fields, ['Brand Name'], 'Unknown brand'),
      price: firstNumberValue(fields, ['Selling Price']),
      quantity: firstNumberValue(fields, ['Inventory Quantity'])
    }
  }

  if (platform === 'flipkart') {
    return {
      sku: firstTextValue(fields, ['Seller SKU ID']),
      title: firstTextValue(fields, ['Product Title', 'Model Name'], 'Untitled listing'),
      brand: firstTextValue(fields, ['Brand'], 'Unknown brand'),
      price: firstNumberValue(fields, ['Your selling price (INR)']),
      quantity: firstNumberValue(fields, ['Stock'])
    }
  }

  if (platform === 'shopify') {
    return {
      sku: firstTextValue(fields, ['Variant SKU']),
      title: firstTextValue(fields, ['Title'], 'Untitled listing'),
      brand: firstTextValue(fields, ['Vendor'], 'Unknown brand'),
      price: firstNumberValue(fields, ['Variant Price']),
      quantity: firstNumberValue(fields, ['Variant Inventory Qty'])
    }
  }

  if (platform === 'best-buy') {
    return {
      sku: firstTextValue(fields, ['Shop sku', 'Offer SKU']),
      title: firstTextValue(fields, ['Title BB (EN)'], 'Untitled listing'),
      brand: firstTextValue(fields, ['Brand Name'], 'Unknown brand'),
      price: firstNumberValue(fields, ['Offer Price']),
      quantity: firstNumberValue(fields, ['Offer Quantity'])
    }
  }

  if (platform === 'wayfair') {
    return {
      sku: firstTextValue(fields, ['Supplier Part Number']),
      title: firstTextValue(fields, ['Product Name'], 'Untitled listing'),
      brand: firstTextValue(fields, ['Brand'], 'Unknown brand'),
      price: firstNumberValue(fields, ['Wholesale Price']),
      quantity: firstNumberValue(fields, ['Quantity'])
    }
  }

  return {
    sku: firstTextValue(fields, ['sku', 'sellerSku', 'shopSku', 'itemSku']),
    title: firstTextValue(fields, ['title', 'name', 'goodsName'], 'Untitled listing'),
    brand: firstTextValue(fields, ['brand'], 'Unknown brand'),
    price: firstNumberValue(fields, ['price']),
    quantity: firstNumberValue(fields, ['quantity'])
  }
}

const renderPayloadPreview = () => {
  const fields = collectMarketplaceFields()
  const visible = Object.entries(fields).slice(0, 10)

  els.payloadPreview.innerHTML = `
    <div class="summary-list">
      <div><span>Marketplace fields filled</span><strong>${Object.keys(fields).length}</strong></div>
      <div><span>Storage</span><strong>platformFields JSONB</strong></div>
      <div><span>Inventory</span><strong>Central SKU link</strong></div>
    </div>
    ${
      visible.length
        ? `<div class="summary-fields">${visible
            .map(
              ([key, value]) => `
                <div>
                  <span>${friendlyFieldLabel(key)}</span>
                  <strong>${Array.isArray(value) ? value.join(', ') : String(value)}</strong>
                </div>
              `
            )
            .join('')}</div>`
        : '<p class="empty-state">Fill marketplace-specific fields to see a summary.</p>'
    }
  `
}

const openSummaryModal = () => {
  renderPayloadPreview()
  els.summaryModal.hidden = false
  els.summaryCloseButton.focus()
}

const closeSummaryModal = () => {
  els.summaryModal.hidden = true
  els.summaryButton.focus()
}

const updateFieldGuide = () => {
  const platform = els.platformSelect.value as ListingPlatform
  const fields = fieldSets[platform]
  const query = els.fieldSearch.value.trim().toLowerCase()
  const visibleFields = query
    ? fields.filter(field =>
        field.toLowerCase().includes(query)
      )
    : fields

  els.marketplaceFields.innerHTML = visibleFields
    .map(field => `
      <label class="marketplace-field">
        <span>${friendlyFieldLabel(field)}</span>
        <input
          data-field="${field}"
          name="${field}"
          placeholder="${escapeAttribute(placeholderForField(platform, field))}"
          value=""
        />
      </label>
    `)
    .join('')

  els.marketplaceFields
    .querySelectorAll<HTMLInputElement>('[data-field]')
    .forEach(input => {
      input.addEventListener('input', renderPayloadPreview)
    })

  renderPayloadPreview()
}

const renderPlatformSummary = (
  analytics: AnalyticsResponse
) => {
  els.platformSummary.innerHTML = listingPlatforms
    .map(platform => `
      <article class="platform-card">
        <span>${platformLabels[platform]}</span>
        <strong>${analytics.listings.byPlatform?.[platform] || 0}</strong>
        <small>${analytics.inventory?.byPlatform[platform] || 0} stock links</small>
      </article>
    `)
    .join('')
}

const renderQueueMetrics = (metrics: QueueMetrics) => {
  els.queueDriver.textContent = metrics.driver

  const items: Array<[string, number]> = [
    ['Waiting', metrics.waiting],
    ['Delayed', metrics.delayed],
    ['Active', metrics.active],
    ['Completed', metrics.completed],
    ['Failed', metrics.failed],
    ['Dead letters', metrics.deadLettered]
  ]

  els.queueMetrics.innerHTML = items
    .map(([label, value]) => `
      <div class="queue-item">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
    `)
    .join('')
}

const renderEvents = (
  target: HTMLElement,
  events: AuditEvent[],
  limit?: number
) => {
  const visible =
    typeof limit === 'number' ? events.slice(0, limit) : events

  target.innerHTML = visible.length
    ? visible
        .map(event => `
          <article class="event-item">
            <strong>${event.event}</strong>
            <span>${event.resourceType} / ${event.resourceId}</span>
            <span>${formatDate(event.createdAt)}</span>
          </article>
        `)
        .join('')
    : '<article class="event-item"><strong>No activity yet</strong><span>Audit entries will appear here.</span></article>'
}

const renderListings = (listings: Listing[]) => {
  const sorted = listings.sort(
    (left, right) =>
      new Date(right.createdAt || 0).getTime() -
      new Date(left.createdAt || 0).getTime()
  )

  els.listingsTable.innerHTML = sorted.length
    ? sorted
        .map(listing => `
          <tr>
            <td>${platformLabels[listing.platform] ?? listing.platform}</td>
            <td>${listing.sku}</td>
            <td>${listing.inventorySku ?? listing.sku}</td>
            <td>${listing.sellerId}</td>
            <td><span class="status-tag ${statusClass(listing.status)}">${listing.status}</span></td>
            <td>${formatDate(listing.createdAt)}</td>
            <td>
              <button class="delete-button" data-delete-id="${listing.id}" data-platform="${listing.platform}">Delete</button>
            </td>
          </tr>
        `)
        .join('')
    : '<tr><td colspan="7">No listings found.</td></tr>'
}

const renderSimulatorListings = (
  listings: SimulatorListing[]
) => {
  els.simulatorSkuSelect.innerHTML = listings.length
    ? listings
        .map(listing => `
          <option value="${listing.sku}">
            ${listing.sku} / ${listing.sellerId}
          </option>
        `)
        .join('')
    : '<option value="">No products listed</option>'

  els.simulatorListingsTable.innerHTML = listings.length
    ? listings
        .map(listing => `
          <tr>
            <td>${listing.sku}</td>
            <td>${listing.sellerId}</td>
            <td><span class="status-tag ${statusClass(listing.status)}">${listing.status}</span></td>
            <td>${listing.inventorySku ?? listing.sku}</td>
            <td>${listing.inventory?.quantity ?? 0}</td>
          </tr>
        `)
        .join('')
    : '<tr><td colspan="5">No products listed on this marketplace.</td></tr>'
}

const loadSimulatorListings = async () => {
  const platform =
    els.simulatorPlatformSelect.value as ListingPlatform

  if (!platform) {
    return
  }

  const listings = await api<SimulatorListing[]>(
    `/marketplace-simulator/${encodeURIComponent(platform)}/listings`
  )

  renderSimulatorListings(listings)
}

const renderWebhooks = (deliveries: WebhookDelivery[]) => {
  els.webhooksTable.innerHTML = deliveries.length
    ? deliveries
        .map(delivery => `
          <tr>
            <td>${delivery.event}</td>
            <td>${delivery.platform}</td>
            <td><span class="status-tag ${statusClass(delivery.status)}">${delivery.status}</span></td>
            <td>${delivery.attempts}</td>
            <td>${delivery.url}</td>
            <td>${formatDate(delivery.updatedAt)}</td>
          </tr>
        `)
        .join('')
    : '<tr><td colspan="6">No webhook deliveries yet.</td></tr>'
}

const listingsForInventorySku = (sku: string) =>
  state.listings.filter(
    listing =>
      (listing.inventorySku ?? listing.sku) === sku ||
      listing.sku === sku
  )

const orderStatsForInventorySku = (
  sku: string,
  platform: ListingPlatform
) => {
  const platformOrders = state.orders.filter(
    order => order.platform === platform
  )
  const productOrders = platformOrders.filter(order =>
    order.orderItems.some(
      item =>
        item.inventorySku === sku ||
        item.sku === sku
    )
  )
  const productQuantity = productOrders.reduce(
    (sum, order) =>
      sum +
      order.orderItems
        .filter(
          item =>
            item.inventorySku === sku ||
            item.sku === sku
        )
        .reduce(
          (itemSum, item) => itemSum + item.quantity,
          0
        ),
    0
  )

  return {
    productOrders: productOrders.length,
    productQuantity,
    platformOrders: platformOrders.length
  }
}

const renderInventoryResult = (
  item: InventoryItem,
  exactListings?: Listing[]
) => {
  const linkedListings =
    exactListings ?? listingsForInventorySku(item.sku)
  const linkedPlatforms = Array.from(
    new Set(linkedListings.map(listing => listing.platform))
  )
  const platformOrderRows = linkedPlatforms.map(platform => {
    const listings = linkedListings.filter(
      listing => listing.platform === platform
    )
    const stats = orderStatsForInventorySku(
      item.sku,
      platform
    )

    return {
      platform,
      listings,
      quantity: stats.productQuantity
    }
  })
  const totalProductQuantity = platformOrderRows.reduce(
    (sum, row) => sum + row.quantity,
    0
  )

  els.inventoryResult.classList.remove('is-error')
  els.inventoryResult.innerHTML = `
    <div class="inventory-summary">
      <div class="inventory-summary-main">
        <span>Available stock</span>
        <strong>${item.quantity}</strong>
      </div>
      <div class="inventory-summary-details">
        <div>
          <span>SKU</span>
          <strong>${item.sku}</strong>
        </div>
        <div>
          <span>Last updated</span>
          <strong>${formatDate(item.updatedAt)}</strong>
        </div>
      </div>
    </div>
    <div class="inventory-platforms">
      <div class="inventory-platforms-heading">
        <span>Quantity sold for this product</span>
        <strong>${linkedPlatforms.length}</strong>
      </div>
      ${
        platformOrderRows.length
          ? `<div class="inventory-platform-list">${platformOrderRows
              .map(
                row => `
                  <div class="inventory-platform-item">
                    <div>
                      <strong>${platformLabels[row.platform] ?? row.platform}</strong>
                      <span>${row.listings
                        .map(listing => `${listing.sku} / ${listing.sellerId}`)
                        .join(', ')}</span>
                    </div>
                    <div class="inventory-order-stats">
                      <span>Quantity <strong>${row.quantity}</strong></span>
                    </div>
                  </div>
                `
              )
              .join('')}
              <div class="inventory-platform-total">
                <span>Total quantity sold</span>
                <strong>${totalProductQuantity}</strong>
              </div>
            </div>`
          : '<p class="empty-state">This SKU is not linked to any marketplace listings.</p>'
      }
    </div>
  `
}

const stockClass = (quantity: number) => {
  if (quantity === 0) {
    return 'failed'
  }

  if (quantity < 10) {
    return 'pending'
  }

  return 'discoverable'
}

const stockLabel = (quantity: number) => {
  if (quantity === 0) {
    return 'Empty'
  }

  if (quantity < 10) {
    return 'Below 10'
  }

  return 'In stock'
}

const renderInventoryTable = (items: InventoryItem[]) => {
  const lowStock = items.sort(
    (left, right) => left.quantity - right.quantity
  )

  els.inventoryTable.innerHTML = lowStock.length
    ? lowStock
        .map(item => `
          <tr>
            <td><strong>${item.sku}</strong></td>
            <td>${item.quantity}</td>
            <td><span class="status-tag ${stockClass(item.quantity)}">${stockLabel(item.quantity)}</span></td>
            <td>${formatDate(item.updatedAt)}</td>
          </tr>
        `)
        .join('')
    : '<tr><td colspan="4">No empty or below-10 stock items.</td></tr>'
}

const renderInventorySummary = (
  summary: InventorySummary
) => {
  els.inventoryTotalCount.textContent =
    String(summary.totalSkus)
  els.inventoryTotalUnits.textContent =
    String(summary.totalUnits)
  els.inventoryLowCount.textContent =
    String(summary.lowOrEmpty)
}

const linkedListingsForSku = async (sku: string) =>
  api<Listing[]>(
    `/dashboard/processing-status?inventorySku=${encodeURIComponent(sku)}&limit=100`
  )

const renderInventoryError = (message: string) => {
  els.inventoryResult.classList.add('is-error')
  els.inventoryResult.innerHTML = `
    <p class="empty-state">${message}</p>
  `
}

const refresh = async () => {
  try {
    const [
      analytics,
      listings,
      events,
      webhooks,
      inventorySummary,
      inventory,
      orders,
      queueMetrics
    ] = await Promise.all([
      api<AnalyticsResponse>('/dashboard/analytics'),
      api<Listing[]>('/dashboard/processing-status?limit=50'),
      api<AuditEvent[]>('/dashboard/events'),
      api<WebhookDelivery[]>('/dashboard/webhooks'),
      api<InventorySummary>('/inventory-summary'),
      api<InventoryItem[]>('/inventory?below=10&limit=50'),
      api<OrderRecord[]>('/marketplace-simulator/orders'),
      api<QueueMetrics>('/dashboard/queue-metrics')
    ])

    els.metricTotalListings.textContent =
      String(analytics.listings.total)
    els.metricDiscoverable.textContent =
      String(analytics.listings.byStatus.DISCOVERABLE || 0)
    els.metricInventoryItems.textContent =
      String(analytics.inventory?.total || 0)
    els.metricWebhookDeliveries.textContent =
      String(analytics.webhooks.totalDeliveries)

    state.listings = listings
    state.orders = orders
    renderPlatformSummary(analytics)
    renderQueueMetrics(queueMetrics)
    renderEvents(els.recentEvents, events, 5)
    renderEvents(els.eventLog, events)
    renderListings(listings)
    renderWebhooks(webhooks)
    renderInventorySummary(inventorySummary)
    renderInventoryTable(inventory)
    await loadSimulatorListings()
  } catch (error) {
    toast(
      error instanceof Error
        ? error.message
        : 'Unknown dashboard error'
    )
  }
}

const switchTab = (tabId: string) => {
  els.navButtons.forEach(button => {
    button.classList.toggle(
      'is-active',
      button.dataset.tab === tabId
    )
  })

  els.panels.forEach(panel => {
    panel.classList.toggle('is-active', panel.id === tabId)
  })
}

els.platformSelect.innerHTML = listingPlatforms
  .map(platform => `
    <option value="${platform}">${platformLabels[platform]}</option>
  `)
  .join('')

els.simulatorPlatformSelect.innerHTML = listingPlatforms
  .map(platform => `
    <option value="${platform}">${platformLabels[platform]}</option>
  `)
  .join('')

els.navButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (button.dataset.tab) {
      switchTab(button.dataset.tab)
    }
  })
})

els.refreshButton.addEventListener(
  'click',
  () => void refresh()
)

els.platformSelect.addEventListener('change', () => {
  els.fieldSearch.value = ''
  updateFieldGuide()
})
els.simulatorPlatformSelect.addEventListener('change', () => {
  void loadSimulatorListings()
})
els.fieldSearch.addEventListener('input', updateFieldGuide)
els.fieldSearchButton.addEventListener('click', () => {
  updateFieldGuide()
  els.fieldSearch.focus()
})
els.clearFieldsButton.addEventListener('click', () => {
  els.marketplaceFields
    .querySelectorAll<HTMLInputElement>('[data-field]')
    .forEach(input => {
      input.value = ''
    })
  renderPayloadPreview()
})
els.summaryButton.addEventListener('click', openSummaryModal)
els.summaryCloseButton.addEventListener('click', closeSummaryModal)
els.summaryModal.addEventListener('click', event => {
  if (event.target === els.summaryModal) {
    closeSummaryModal()
  }
})
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !els.summaryModal.hidden) {
    closeSummaryModal()
  }
})

els.listingForm.addEventListener('submit', event => {
  event.preventDefault()

  void (async () => {
    const form = new FormData(els.listingForm)
    const platform = String(
      form.get('platform')
    ) as ListingPlatform
    const sellerId = String(form.get('sellerId')).trim()

    try {
      const marketplaceFields = collectMarketplaceFields()
      const coreInput = coreInputFromMarketplaceFields(
        platform,
        marketplaceFields
      )
      const sku = coreInput.sku

      if (!sku) {
        toast('Enter the SKU field before submitting')
        return
      }

      const inventorySku = sku
      const coreFields = corePayloadForPlatform(platform, {
        sku,
        inventorySku,
        title: coreInput.title,
        brand: coreInput.brand,
        price: coreInput.price,
        quantity: coreInput.quantity
      })
      const payload = {
        ...coreFields,
        ...marketplaceFields,
        title: coreInput.title,
        brand: coreInput.brand,
        inventorySku,
        ...(coreInput.price
          ? { price: coreInput.price }
          : {}),
        ...(coreInput.quantity
          ? { quantity: coreInput.quantity }
          : {}),
        attributes: {
          brand: [{ value: coreInput.brand }],
          item_name: [{ value: coreInput.title }]
        }
      }

      await api(createListingApiPath(platform, sellerId, sku), {
        method: 'PUT',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      toast('Listing submitted')
      await refresh()
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : 'Failed to submit listing'
      )
    }
  })()
})

els.listingsTable.addEventListener('click', event => {
  const target = event.target

  if (!(target instanceof Element)) {
    return
  }

  const button = target.closest<HTMLButtonElement>(
    '[data-delete-id]'
  )

  if (!button?.dataset.deleteId) {
    return
  }

  void (async () => {
    try {
      await api(
        `${listingApiBase(button.dataset.platform as ListingPlatform)}/id/${button.dataset.deleteId}`,
        { method: 'DELETE' }
      )
      toast('Listing deleted')
      await refresh()
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : 'Failed to delete listing'
      )
    }
  })()
})

els.inventoryForm.addEventListener('submit', event => {
  event.preventDefault()

  void (async () => {
    const form = new FormData(els.inventoryForm)
    const sku = String(form.get('sku')).trim()
    const quantityToAdd = Number(form.get('quantity'))

    try {
      let currentQuantity = 0

      try {
        const current = await api<InventoryItem>(
          `/inventory/${encodeURIComponent(sku)}`
        )
        currentQuantity = current.quantity
      } catch {
        currentQuantity = 0
      }

      const item = await api<InventoryItem>(
        `/inventory/${encodeURIComponent(sku)}`,
        {
          method: 'PATCH',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            quantity: currentQuantity + quantityToAdd
          })
        }
      )

      const linkedListings =
        await linkedListingsForSku(item.sku)
      state.listings = [
        ...linkedListings,
        ...state.listings.filter(
          listing =>
            (listing.inventorySku ?? listing.sku) !==
            item.sku
        )
      ]
      renderInventoryResult(item, linkedListings)
      toast('Stock added')
      await refresh()
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : 'Failed to update inventory'
      )
    }
  })()
})

els.inventoryLookupButton.addEventListener('click', () => {
  void (async () => {
    try {
      const sku = els.inventoryLookupSku.value.trim()
      const item = await api<InventoryItem>(
        `/inventory/${encodeURIComponent(sku)}`
      )
      const linkedListings =
        await linkedListingsForSku(item.sku)
      state.listings = [
        ...linkedListings,
        ...state.listings.filter(
          listing =>
            (listing.inventorySku ?? listing.sku) !==
            item.sku
        )
      ]
      renderInventoryResult(item, linkedListings)
    } catch (error) {
      renderInventoryError(
        error instanceof Error
          ? error.message
          : 'Inventory lookup failed'
      )
    }
  })()
})

els.simulatorForm.addEventListener('submit', event => {
  event.preventDefault()

  void (async () => {
    const form = new FormData(els.simulatorForm)
    const platform = String(form.get('platform'))
    const sku = String(form.get('sku')).trim()
    const quantity = Number(form.get('quantity'))
    const webhookUrl = String(
      form.get('webhookUrl') ?? ''
    ).trim()

    if (!sku) {
      toast('Select a product before placing an order')
      return
    }

    try {
      const result = await api<PlaceOrderResult>(
        `/marketplace-simulator/${encodeURIComponent(platform)}/orders`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            sku,
            quantity,
            ...(webhookUrl ? { webhookUrl } : {})
          })
        }
      )

      toast(
        `Order ${result.order.marketplaceOrderId} placed`
      )
      const linkedListings =
        await linkedListingsForSku(result.inventory.sku)
      renderInventoryResult(
        result.inventory,
        linkedListings
      )
      await refresh()
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : 'Failed to place order'
      )
    }
  })()
})

updateFieldGuide()
void refresh()
state.refreshTimer = window.setInterval(refresh, 30000)
