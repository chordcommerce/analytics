import type { AnyId, ObjectTypes } from './client.js'
import type {
  Filter,
  Sort,
  SubscriptionCancelledAddress,
} from './typewriter.js'

export interface ProductInput<
  ProductType extends ObjectTypes['Product'] = ObjectTypes['Product']
> {
  /**
   * The position in a list of the product that was added, if relevant.
   */
  position?: number
  /**
   * Product and variant details, like product name and variant SKUs.
   */
  product: ProductType
  /**
   * The quantity of the product involved in the tracking event. Sometimes quantity might
   * not be relevant to an event, and can be either omitted or defaulted to `1`.
   */
  quantity?: number
  /**
   * The unique identifier of the product variant. This should allow you to look up the
   * selected variant details from the `product` object. If not provided, it's typical
   * to default to the first product variant, or default product variant if that's a concept
   * that exists in your product catalog.
   */
  variantId?: AnyId
}

export interface CartInput<
  CartType extends ObjectTypes['Cart'] = ObjectTypes['Cart']
> {
  /**
   * The current cart.
   */
  cart: CartType
}

export interface CheckoutInput<
  CheckoutType extends ObjectTypes['Checkout'] = ObjectTypes['Checkout']
> {
  /**
   * The current checkout.
   */
  checkout: CheckoutType
}

export interface LineItemInput<
  LineItemType extends ObjectTypes['LineItem'] = ObjectTypes['LineItem']
> {
  /**
   * The line item before it was removed.
   */
  lineItem: LineItemType
}

export interface CartViewedInput<T extends ObjectTypes = ObjectTypes> {
  /**
   * The current cart.
   */
  cart: T['Cart']
}

export interface CheckoutStartedInput<T extends ObjectTypes = ObjectTypes> {
  /**
   * The current checkout.
   */
  checkout: T['Checkout']
}

export interface CheckoutStepCompletedInput {
  /**
   * The current checkout.
   */
  checkoutId: string
  /**
   * The step that was completed.
   */
  step: number
  /**
   * String representing the payment method chosen
   */
  paymentMethod?: string
  /**
   * String representing the shipping the method chosen
   */
  shippingMethod?: string
}

export interface CheckoutStepViewedInput {
  /**
   * The current checkout.
   */
  checkoutId: string

  /**
   * The step that was completed.
   */
  step: number
  /**
   * String representing the payment method chosen
   */
  paymentMethod?: string
  /**
   * String representing the shipping the method chosen
   */
  shippingMethod?: string
}

/**
 * Coupon was applied on a user's shopping cart or order
 */
export interface CouponAppliedInput {
  /**
   * Cart ID, if applicable
   */
  cartId?: string
  /**
   * Coupon ID
   */
  couponId?: string
  /**
   * Coupon name
   */
  couponName?: string
  /**
   * Monetary discount applied through the coupon
   */
  discount?: number
  /**
   * Order/transaction ID, if applicable
   */
  orderId?: string
}

/**
 * Coupon was denied from a user's shopping cart or order
 */
export interface CouponDeniedInput {
  /**
   * Cart ID, if applicable
   */
  cartId?: string
  /**
   * Coupon ID
   */
  couponId?: string
  /**
   * Coupon name
   */
  couponName?: string
  /**
   * Order/transaction ID, if applicable
   */
  orderId?: string
  /**
   * Reason the coupon was denied
   */
  reason?: string
}

/**
 * User entered a coupon on a shopping cart or order
 */
export interface CouponEnteredInput {
  /**
   * Cart ID, if applicable
   */
  cartId?: string
  /**
   * Coupon ID
   */
  couponId?: string
  /**
   * Coupon name
   */
  couponName?: string
  /**
   * Order/transaction ID, if applicable
   */
  orderId?: string
}

/**
 * User removed a coupon from a cart or order
 */
export interface CouponRemovedInput {
  /**
   * Cart ID, if applicable
   */
  cartId?: string
  /**
   * Coupon ID
   */
  couponId?: string
  /**
   * Coupon name
   */
  couponName?: string
  /**
   * Monetary discount applied through the coupon
   */
  discount?: number
  /**
   * Order/transaction ID, if applicable
   */
  orderId?: string
  [property: string]: any
}

export interface EmailCapturedInput {
  email?: string
  placementComponent?: string
  placementPage?: string
}

export interface ProductAddedInput<T extends ObjectTypes = ObjectTypes> {
  /**
   * The current cart, after the product is added.
   */
  cart: T['Cart']
  product: ProductInput<T['Product']>
  // lineItem?: AnyLineItem TODO: add this
}

export interface ProductClickedInput<T extends ObjectTypes = ObjectTypes> {
  /**
   * The current cart.
   */
  cart: T['Cart']
  listId?: AnyId
  listName?: string
  product: ProductInput<T['Product']>
  // lineItem?: AnyLineItem TODO: add this
}

export interface VariantClickedInput<T extends ObjectTypes = ObjectTypes> {
  /**
   * The current cart.
   */
  cart: T['Cart']
  coupon?: string
  lineItemId?: string
  product: ProductInput<T['Product']>
  couponId?: string
}

export interface ProductListFilteredInput {
  category?: string
  listId?: string
  listName?: string
  filters?: Filter[]
  sorts?: Sort[]
}

export interface ProductListViewedInput<T extends ObjectTypes = ObjectTypes> {
  category?: string
  listId?: string
  listName?: string
  products: ProductInput<T['Product']>[]
}

export interface ProductRemovedInput<T extends ObjectTypes = ObjectTypes> {
  /**
   * The current cart.
   */
  cart: T['Cart']
  /**
   * The line item before it was removed.
   */
  lineItem: T['LineItem']
  // product?: ProductInput TODO: add this
}

export interface ProductViewedInput<T extends ObjectTypes = ObjectTypes> {
  /**
   * The current cart.
   */
  cart: T['Cart']
  /**
   * The product being viewed.
   */
  product: ProductInput<T['Product']>
  // lineItem?: AnyLineItem TODO: add this
}

export interface ProductsSearchedInput {
  currency?: string
  price?: number
  productId?: AnyId
  quantity?: number
  query?: string
}

export interface SignedInInput {
  /**
   * The email of the user
   */
  email?: string
  /**
   * The method used to login
   */
  method?: string
}

export interface SignedOutInput {
  /**
   * The email of the user
   */
  email?: string
}

export interface SignedUpInput {
  /**
   * The email of the user
   */
  email?: string
  /**
   * The method used to login
   */
  method?: string
}

export interface LoginStartedInput {
  /**
   * The email of the user
   */
  email?: string
}

export interface SubscriptionCancelledInput<
  T extends ObjectTypes = ObjectTypes
> {
  /**
   * Next date when this subscription will be actionable (renewed, expired, etc.)
   */
  actionableDate?: string
  /**
   * Shipping address for the subscription
   */
  address?: SubscriptionCancelledAddress
  /**
   * Brand associated with the subscription
   */
  brand?: string
  /**
   * Currency code of the transaction (for example, "USD")
   */
  currency?: string
  /**
   * Email address associated with the subscription
   */
  email?: string
  /**
   * Subscription will stop auto-renewing after this date
   */
  endDate?: string
  /**
   * Interval number at which the subscription renews
   */
  intervalLength?: number
  /**
   * Interval unit at which the subscription renews (for example, "month")
   */
  intervalUnits?: string
  /**
   * Products in the subscription
   */
  products?: ProductInput<T['Product']>[]
  /**
   * The state of the subscription (for example, "active")
   */
  state?: string
  /**
   * ID of the subscription
   */
  subscriptionId?: string
}
export interface NavigationClickedInput {
  /**
   * Name of menu or category where navigation link was clicked (for example, "Support")
   */
  category?: string
  /**
   * Navigation label clicked (for example, "Contact")
   */
  label?: string
  /**
   * Navigation HTML component within the UX (for example, "footer")
   */
  navigationPlacement?: string
  /**
   * Navigation label clicked (for example, "Contact")
   */
  navigationTitle?: string
  /**
   * URL of navigation link destination
   */
  navigationUrl?: string
}

export interface PaymentInfoEnteredInput<T extends ObjectTypes = ObjectTypes> {
  /**
   * Checkout transaction ID
   */
  checkoutId?: string
  /**
   * Transaction coupon redeemed with the transaction
   */
  coupon?: string
  /**
   * Currency code of the transaction (for example, "USD")
   */
  currency?: string
  /**
   * Order ID
   */
  orderId?: string
  /**
   * String representing the payment method chosen
   */
  paymentMethod?: string
  /**
   * Products in the order
   */
  products: ProductInput<T['Product']>[]
  /**
   * String representing the shipping the method chosen
   */
  shippingMethod?: string
  /**
   * Number representing a step in the checkout process
   */
  step: number
  /**
   * Revenue ($) with discounts and coupons added in
   */
  value?: number
}
