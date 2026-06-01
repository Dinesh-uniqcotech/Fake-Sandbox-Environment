import {
  amazonEbayFields,
  bestBuyFields,
  flipkartFields,
  shopifyFields,
  walmartFields,
  wayfairFields
} from '../validators/listing-validator'

const sameNameMapping = (fields: string[]) =>
  Object.fromEntries(fields.map(field => [field, field]))

export const defaultMarketplaceFieldMappings = [
  {
    platform: 'amazon',
    marketplaceName: 'Amazon',
    fields: amazonEbayFields,
    mapping: {
      ...sameNameMapping(amazonEbayFields),
      sku: 'SKU',
      title: 'Item Name',
      brand: 'Brand Name',
      price: 'Your Price',
      quantity: 'Quantity'
    }
  },
  {
    platform: 'ebay',
    marketplaceName: 'eBay',
    fields: amazonEbayFields,
    mapping: {
      ...sameNameMapping(amazonEbayFields),
      sku: 'SKU',
      title: 'Item Name',
      brand: 'Brand Name',
      price: 'Your Price',
      quantity: 'Quantity'
    }
  },
  {
    platform: 'flipkart',
    marketplaceName: 'Flipkart',
    fields: flipkartFields,
    mapping: {
      ...sameNameMapping(flipkartFields),
      sku: 'Seller SKU ID',
      title: 'Model Name',
      brand: 'Brand',
      price: 'Your selling price (INR)',
      quantity: 'Stock'
    }
  },
  {
    platform: 'walmart',
    marketplaceName: 'Walmart',
    fields: walmartFields,
    mapping: {
      ...sameNameMapping(walmartFields),
      sku: 'SKU',
      title: 'Product Name',
      brand: 'Brand Name',
      price: 'Selling Price',
      quantity: 'Inventory Quantity'
    }
  },
  {
    platform: 'shopify',
    marketplaceName: 'Shopify',
    fields: shopifyFields,
    mapping: {
      ...sameNameMapping(shopifyFields),
      title: 'Title',
      description: 'Description',
      brand: 'Vendor',
      sku: 'Variant SKU',
      price: 'Variant Price',
      quantity: 'Variant Inventory Qty'
    }
  },
  {
    platform: 'best-buy',
    marketplaceName: 'Best Buy',
    fields: bestBuyFields,
    mapping: {
      ...sameNameMapping(bestBuyFields),
      sku: 'Shop sku',
      title: 'Title BB (EN)',
      brand: 'Brand Name',
      price: 'Offer Price',
      quantity: 'Offer Quantity'
    }
  },
  {
    platform: 'wayfair',
    marketplaceName: 'Wayfair',
    fields: wayfairFields,
    mapping: {
      ...sameNameMapping(wayfairFields),
      sku: 'Supplier Part Number',
      title: 'Product Name',
      brand: 'Brand',
      price: 'Base Cost',
      quantity: 'Display Set Quantity'
    }
  }
]
