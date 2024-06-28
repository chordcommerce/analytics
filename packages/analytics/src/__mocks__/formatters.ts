import type {
  CartFormatter,
  CheckoutFormatter,
  LineItemFormatter,
  ProductFormatter,
} from '../types/index.js'
import { MockCart, MockCheckout, MockLineItem, MockProduct } from './objects.js'

export const mockProductFormatter: ProductFormatter<MockProduct> = jest.fn(
  ({ position, product, quantity, variantId }) => ({
    affiliation: product.affiliation,
    brand: product.brand,
    bundle: product.bundle,
    category: product.category,
    description: product.description,
    image_url: product.imageUrl,
    name: product.name,
    option_values: product.optionValues,
    position,
    price: product.price,
    product_id: product.productId,
    quantity,
    sku: product.sku,
    slug: product.slug,
    url: product.url,
    variant: product.variant,
    variant_id: variantId,
  })
)

export const mockLineItemFormatter: LineItemFormatter<MockLineItem> = jest.fn(
  ({ lineItem }) => ({
    ...mockProductFormatter({ product: lineItem }),
    coupon: lineItem.coupon,
    line_item_id: lineItem.lineItemId,
    quantity: lineItem.quantity,
  })
)

export const mockCartFormatter: CartFormatter<MockCart> = jest.fn(
  ({ cart }) => ({
    cart_id: cart.cartId,
    currency: cart.currency,
    products: cart.products.map((product, i) => ({
      ...mockLineItemFormatter({ lineItem: product }),
      position: i + 1,
    })),
    value: cart.value,
  })
)

export const mockCheckoutFormatter: CheckoutFormatter<MockCheckout> = jest.fn(
  ({ checkout }) => ({
    affiliation: checkout.affiliation,
    checkout_type: checkout.checkoutType,
    coupon: checkout.coupon,
    currency: checkout.currency,
    discount: checkout.discount,
    order_id: checkout.orderId,
    order_name: checkout.orderName,
    products: checkout.products.map((product, i) => ({
      ...mockLineItemFormatter({ lineItem: product }),
      position: i + 1,
    })),
    revenue: checkout.revenue,
    shipping: checkout.shipping,
    tax: checkout.tax,
    value: checkout.value,
  })
)
