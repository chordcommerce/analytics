import type {
  CartViewed,
  CheckoutStarted,
  CheckoutStepCompleted,
  CheckoutStepViewed,
  ProductAdded,
  ProductClicked,
  VariantClicked,
  ProductViewed,
  ProductListViewed,
  CouponApplied,
  CouponDenied,
  CouponEntered,
  CouponRemoved,
  EmailCaptured,
  ProductListFiltered,
  ProductRemoved,
  ProductsSearched,
  SignedIn,
  SignedOut,
  SignedUp,
  LoginStarted,
  SubscriptionCancelled,
  NavigationClicked,
  PaymentInfoEntered,
} from './typewriter.js'

import type { Cart, Checkout, LineItem, Product } from './objects.js'

import type {
  CartInput,
  CheckoutInput,
  CheckoutStepCompletedInput,
  CheckoutStepViewedInput,
  LineItemInput,
  ProductInput,
  CartViewedInput,
  CheckoutStartedInput,
  ProductAddedInput,
  ProductClickedInput,
  VariantClickedInput,
  ProductViewedInput,
  ProductListViewedInput,
  ProductListFilteredInput,
  ProductRemovedInput,
  CouponAppliedInput,
  CouponDeniedInput,
  CouponEnteredInput,
  CouponRemovedInput,
  EmailCapturedInput,
  ProductsSearchedInput,
  SignedInInput,
  SignedOutInput,
  SignedUpInput,
  LoginStartedInput,
  SubscriptionCancelledInput,
  NavigationClickedInput,
  PaymentInfoEnteredInput,
} from './input.js'

import type { ObjectTypes } from './client.js'

export type CartFormatter<T = ObjectTypes['Cart']> = (
  props: CartInput<T>
) => Cart

export type CheckoutFormatter<T = ObjectTypes['Checkout']> = (
  props: CheckoutInput<T>
) => Checkout

export type LineItemFormatter<T = ObjectTypes['LineItem']> = (
  props: LineItemInput<T>
) => LineItem

export type ProductFormatter<T = ObjectTypes['Product']> = (
  props: ProductInput<T>
) => Product

export interface CartViewedFormatter<T extends ObjectTypes = ObjectTypes> {
  (props: CartViewedInput<T>, event: CartViewed): CartViewed
}

export interface CheckoutStartedFormatter<T extends ObjectTypes = ObjectTypes> {
  (props: CheckoutStartedInput<T>, event: CheckoutStarted): CheckoutStarted
}

export interface CheckoutStepCompletedFormatter {
  (
    props: CheckoutStepCompletedInput,
    event: CheckoutStepCompleted
  ): CheckoutStepCompleted
}

export interface CheckoutStepViewedFormatter {
  (
    props: CheckoutStepViewedInput,
    event: CheckoutStepViewed
  ): CheckoutStepViewed
}

export interface CouponAppliedFormatter {
  (props: CouponAppliedInput, event: CouponApplied): CouponApplied
}

export interface CouponDeniedFormatter {
  (props: CouponDeniedInput, event: CouponDenied): CouponDenied
}

export interface CouponEnteredFormatter {
  (props: CouponEnteredInput, event: CouponEntered): CouponEntered
}

export interface CouponRemovedFormatter {
  (props: CouponRemovedInput, event: CouponRemoved): CouponRemoved
}

export interface EmailCapturedFormatter {
  (props: EmailCapturedInput, event: EmailCaptured): EmailCaptured
}

export interface ProductAddedFormatter<T extends ObjectTypes = ObjectTypes> {
  (props: ProductAddedInput<T>, event: ProductAdded): ProductAdded
}

export interface ProductClickedFormatter<T extends ObjectTypes = ObjectTypes> {
  (props: ProductClickedInput<T>, event: ProductClicked): ProductClicked
}

export interface VariantClickedFormatter<T extends ObjectTypes = ObjectTypes> {
  (props: VariantClickedInput<T>, event: VariantClicked): VariantClicked
}

export interface ProductListFilteredFormatter {
  (
    props: ProductListFilteredInput,
    event: ProductListFiltered
  ): ProductListFiltered
}

export interface ProductListViewedFormatter<
  T extends ObjectTypes = ObjectTypes
> {
  (
    props: ProductListViewedInput<T>,
    event: ProductListViewed
  ): ProductListViewed
}

export interface ProductRemovedFormatter<T extends ObjectTypes = ObjectTypes> {
  (props: ProductRemovedInput<T>, event: ProductRemoved): ProductRemoved
}

export interface ProductViewedFormatter<T extends ObjectTypes = ObjectTypes> {
  (props: ProductViewedInput<T>, event: ProductViewed): ProductViewed
}

export interface ProductsSearchedFormatter {
  (props: ProductsSearchedInput, event: ProductsSearched): ProductsSearched
}

export interface SignedInFormatter {
  (props: SignedInInput, event: SignedIn): SignedIn
}

export interface SignedOutFormatter {
  (props: SignedOutInput, event: SignedOut): SignedOut
}

export interface SignedUpFormatter {
  (props: SignedUpInput, event: SignedUp): SignedUp
}

export interface LoginStartedFormatter {
  (props: LoginStartedInput, event: LoginStarted): LoginStarted
}

export interface SubscriptionCancelledFormatter {
  (
    props: SubscriptionCancelledInput,
    event: SubscriptionCancelled
  ): SubscriptionCancelled
}

export interface NavigationClickedFormatter {
  (props: NavigationClickedInput, event: NavigationClicked): NavigationClicked
}

export interface PaymentInfoEnteredFormatter {
  (
    props: PaymentInfoEnteredInput,
    event: PaymentInfoEntered
  ): PaymentInfoEntered
}
export interface ChordAnalyticsFormatters<T extends ObjectTypes = ObjectTypes> {
  events?: {
    cartViewed?: CartViewedFormatter<T>
    checkoutStarted?: CheckoutStartedFormatter<T>
    checkoutStepCompleted?: CheckoutStepCompletedFormatter
    checkoutStepViewed?: CheckoutStepViewedFormatter
    couponApplied?: CouponAppliedFormatter
    couponDenied?: CouponDeniedFormatter
    couponEntered?: CouponEnteredFormatter
    couponRemoved?: CouponRemovedFormatter
    emailCaptured?: EmailCapturedFormatter
    productAdded?: ProductAddedFormatter<T>
    productClicked?: ProductClickedFormatter<T>
    variantClicked?: VariantClickedFormatter<T>
    productListFiltered?: ProductListFilteredFormatter
    productListViewed?: ProductListViewedFormatter<T>
    productRemoved?: ProductRemovedFormatter<T>
    productViewed?: ProductViewedFormatter<T>
    productsSearched?: ProductsSearchedFormatter
    signedIn?: SignedInFormatter
    signedOut?: SignedOutFormatter
    signedUp?: SignedUpFormatter
    loginStarted?: LoginStartedFormatter
    subscriptionCancelled?: SubscriptionCancelledFormatter
    navigationClicked?: NavigationClickedFormatter
    paymentInfoEntered?: PaymentInfoEnteredFormatter
  }
  objects: {
    cart: CartFormatter<T['Cart']>
    checkout: CheckoutFormatter<T['Checkout']>
    lineItem: LineItemFormatter<T['LineItem']>
    product: ProductFormatter<T['Product']>
  }
}
