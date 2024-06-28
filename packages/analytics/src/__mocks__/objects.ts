export interface MockCart {
  cartId?: string
  currency?: string
  products: MockLineItem[]
  value?: number
}

export interface MockCheckout {
  affiliation: string
  checkoutType: string
  coupon: string
  currency: string
  discount: number
  orderId: string
  orderName: string
  products: MockLineItem[]
  revenue: number
  shipping: number
  tax: number
  value: number
}

export interface MockLineItem extends MockProduct {
  coupon: string
  lineItemId: string
  quantity: number
}

export interface MockProduct {
  affiliation?: string
  brand?: string
  bundle?: boolean
  category?: string
  description?: string
  imageUrl?: string
  name?: string
  optionValues?: string[]
  position?: number
  price?: number
  productId?: string
  sku?: string
  slug?: string
  url?: string
  variant?: string
}
export interface MockAddress {
  address1?: string
  address2?: string
  city?: string
  company?: string
  country?: string
  name?: string
  phone?: string
  state?: string
  zipcode?: string
}

export const mockAddress: MockAddress = {
  address1: '123 Main St',
  address2: 'Apt 4',
  city: 'Anytown',
  company: 'Acme Inc.',
  country: 'USA',
  name: 'John Doe',
  phone: '555-123-4567',
  state: 'CA',
  zipcode: '12345',
}

export const mockProduct: MockProduct = {
  affiliation: 'Mocked Affiliation',
  brand: 'Mocked Brand',
  bundle: true,
  category: 'Mocked Category',
  description: 'Mocked Description',
  imageUrl: 'http://example.com/mock.jpg',
  name: 'Mocked Product',
  optionValues: ['Mocked Option 1', 'Mocked Option 2'],
  position: 1,
  price: 99.99,
  productId: 'mockedProductId',
  sku: 'mockedSku',
  slug: 'mocked-product',
  url: 'http://example.com/mock-product',
  variant: 'Mocked Variant',
}

export const mockLineItem: MockLineItem = {
  ...mockProduct,
  coupon: 'mockedCoupon',
  lineItemId: 'mockedLineItemId',
  quantity: 1,
}

export const mockCart: MockCart = {
  cartId: 'mockedCartId',
  currency: 'USD',
  products: [mockLineItem],
  value: 100,
}

export const mockCheckout: MockCheckout = {
  affiliation: 'Mocked Store',
  checkoutType: 'stripe',
  coupon: 'MOCKEDCOUPON',
  currency: 'USD',
  discount: 10,
  orderId: 'mockedOrderId',
  orderName: 'CHORD-000111222',
  products: [mockLineItem],
  revenue: 100,
  shipping: 5,
  tax: 15,
  value: 110,
}
