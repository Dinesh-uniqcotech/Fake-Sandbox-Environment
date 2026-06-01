import { z } from 'zod'

type FieldValue =
  | string
  | number
  | boolean
  | null
  | FieldValue[]
  | { [key: string]: FieldValue }

const htmlPattern = /<[^>]*>|javascript:/i
const safeText = z
  .string()
  .refine(value => !htmlPattern.test(value), {
    message: 'HTML and script content are not allowed'
  })
const requiredString = safeText.trim().min(1)
const requiredNumber = z.number().nonnegative()
const positiveNumber = z.number().positive()
const positiveInteger = z.number().int().positive()
const fieldValue: z.ZodType<FieldValue> = z.lazy(() =>
  z.union([
    safeText,
    z.number(),
    z.boolean(),
    z.null(),
    z.array(fieldValue),
    z.record(z.string(), fieldValue)
  ])
)

const toCamelCase = (label: string) => {
  const words = label.match(/[A-Za-z0-9]+/g) ?? []

  return words
    .map((word, index) => {
      const lower = word.toLowerCase()
      return index === 0
        ? lower
        : lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join('')
}

const excelFieldShape = (labels: string[]) =>
  labels.reduce<Record<string, z.ZodOptional<typeof fieldValue>>>(
    (shape, label) => {
      shape[label] = fieldValue.optional()
      shape[toCamelCase(label)] = fieldValue.optional()
      return shape
    },
    {}
  )

const commonCommerceFields = {
  productType: requiredString.optional(),
  title: requiredString.optional(),
  description: safeText.optional(),
  category: safeText.optional(),
  brand: requiredString.optional(),
  price: positiveNumber.optional(),
  currency: safeText.optional(),
  quantity: positiveInteger.optional(),
  inventorySku: requiredString.optional(),
  attributes: z
    .object({
      brand: z
        .array(
          z.object({
            value: requiredString
          })
        )
        .min(1)
        .optional(),
      item_name: z
        .array(
          z.object({
            value: requiredString
          })
        )
        .min(1)
        .optional()
    })
    .optional(),
  webhookUrl: z.string().url().optional()
}

export const amazonEbayFields = [
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
]

export const walmartFields = [
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
]

export const shopifyFields = [
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
]

export const flipkartFields = [
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
]

export const bestBuyFields = [
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
]

export const wayfairFields = [
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
]

const excelListingSchema = (labels: string[]) =>
  z.object({
    ...commonCommerceFields,
    ...excelFieldShape(labels)
  })

export const listingSchema =
  excelListingSchema(amazonEbayFields)

export const flipkartListingSchema =
  excelListingSchema(flipkartFields).extend({
    channelSkuId: requiredString.optional(),
    productId: safeText.optional(),
    price: positiveNumber.optional(),
    quantity: positiveInteger.optional(),
    hsn: requiredString.optional(),
    gstRate: requiredNumber.optional(),
    fulfillment: requiredString.optional()
  })

export const walmartListingSchema =
  excelListingSchema(walmartFields).extend({
    itemId: safeText.optional(),
    price: positiveNumber.optional(),
    quantity: positiveInteger.optional(),
    upc: requiredString.optional(),
    mpn: requiredString.optional(),
    brand: requiredString.optional(),
    shippingTemplate: requiredString.optional()
  })

export const ebayListingSchema =
  excelListingSchema(amazonEbayFields).extend({
    itemId: safeText.optional(),
    listingType: requiredString.optional(),
    startPrice: positiveNumber.optional(),
    buyItNowPrice: positiveNumber.optional(),
    condition: requiredString.optional(),
    quantity: positiveInteger.optional(),
    title: requiredString.optional()
  })

export const googleShoppingListingSchema =
  listingSchema.extend({
    offerId: requiredString.optional(),
    googleProductCategory: requiredString.optional(),
    targetCountry: requiredString.optional(),
    contentLanguage: requiredString.optional(),
    condition: requiredString.optional(),
    availability: requiredString.optional()
  })

export const metaMarketplaceListingSchema =
  listingSchema.extend({
    facebookCategoryId: requiredString.optional(),
    listingType: requiredString.optional(),
    condition: requiredString.optional(),
    location: requiredString.optional(),
    availability: requiredString.optional()
  })

export const shopifyListingSchema =
  excelListingSchema(shopifyFields).extend({
    handle: requiredString.optional(),
    vendor: requiredString.optional(),
    productType: requiredString.optional(),
    tags: requiredString.optional(),
    optionName: requiredString.optional(),
    optionValue: requiredString.optional()
  })

export const etsyListingSchema =
  listingSchema.extend({
    taxonomyId: requiredString.optional(),
    whoMade: requiredString.optional(),
    whenMade: requiredString.optional(),
    isSupply: z.boolean().optional(),
    shippingProfileId: requiredString.optional()
  })

export const tiktokShopListingSchema =
  listingSchema.extend({
    productCategoryId: requiredString.optional(),
    warehouseId: requiredString.optional(),
    packageWeight: requiredNumber.optional(),
    packageDimensions: requiredString.optional(),
    sellerSku: requiredString.optional()
  })

export const aliexpressListingSchema =
  listingSchema.extend({
    productGroupId: requiredString.optional(),
    logisticsTemplateId: requiredString.optional(),
    servicePolicyId: requiredString.optional(),
    categoryId: requiredString.optional(),
    shippingFrom: requiredString.optional()
  })

export const rakutenListingSchema =
  listingSchema.extend({
    shopSku: requiredString.optional(),
    genreId: requiredString.optional(),
    warehouseId: requiredString.optional(),
    deliverySetId: requiredString.optional(),
    pointRate: requiredNumber.optional()
  })

export const shopeeListingSchema =
  listingSchema.extend({
    itemSku: requiredString.optional(),
    categoryId: requiredString.optional(),
    logisticsChannelId: requiredString.optional(),
    condition: requiredString.optional(),
    weight: requiredNumber.optional()
  })

export const temuListingSchema =
  listingSchema.extend({
    goodsName: requiredString.optional(),
    categoryId: requiredString.optional(),
    warehouseRegion: requiredString.optional(),
    fulfillmentType: requiredString.optional(),
    manufacturerCode: requiredString.optional()
  })

export const bestBuyListingSchema =
  excelListingSchema(bestBuyFields).extend({
    shopSku: requiredString.optional(),
    titleBbEn: requiredString.optional(),
    shortDescriptionBbEn: requiredString.optional(),
    primaryUpc: safeText.optional(),
    modelNumber: requiredString.optional(),
    manufacturersPartNumber: requiredString.optional(),
    longDescriptionBbEn: requiredString.optional(),
    offerSku: requiredString.optional()
  })

export const wayfairListingSchema =
  excelListingSchema(wayfairFields).extend({
    supplierPartNumber: requiredString.optional(),
    amazonSellerSku: safeText.optional(),
    manufacturerPartNumber: requiredString.optional(),
    universalProductCode: requiredString.optional(),
    productName: requiredString.optional(),
    collectionName: safeText.optional(),
    manufacturerProductUrl: z.string().url().optional(),
    variantType: requiredString.optional(),
    groupReferenceId: safeText.optional()
  })
