import type {
  AnyAnalytics,
  Cart,
  EventProperties,
  Options,
  ValidateResult,
  CheckoutStarted,
  CheckoutStepCompleted,
  CheckoutStepViewed,
  CartViewed,
  ProductListViewed,
  ProductListFiltered,
  ProductClicked,
  VariantClicked,
  ChordAnalyticsOptions,
  AnyOptions,
  CartViewedInput,
  ProductAdded,
  ProductRemoved,
  ProductViewed,
  ProductsSearched,
  EmailCaptured,
  IdentifyTraits,
  CheckoutStartedInput,
  CheckoutStepCompletedInput,
  CheckoutStepViewedInput,
  EmailCapturedInput,
  ProductListViewedInput,
  ProductListFilteredInput,
  ProductAddedInput,
  ProductClickedInput,
  VariantClickedInput,
  ProductRemovedInput,
  ProductViewedInput,
  ProductsSearchedInput,
  CouponApplied,
  CouponDenied,
  CouponEntered,
  CouponRemoved,
  CouponAppliedInput,
  CouponDeniedInput,
  CouponEnteredInput,
  CouponRemovedInput,
  SignedIn,
  SignedInInput,
  SignedOut,
  SignedOutInput,
  SignedUp,
  SignedUpInput,
  LoginStarted,
  LoginStartedInput,
  ObjectTypes,
  SubscriptionCancelled,
  SubscriptionCancelledInput,
  NavigationClicked,
  NavigationClickedInput,
  PaymentInfoEntered,
  PaymentInfoEnteredInput,
} from '../types/index.js'
import { eventSchemas } from '../validators/index.js'
import { pruneNullValues } from '../utils.js'

export interface ChordAnalyticsSnippet {
  _loadOptions: ChordAnalyticsOptions<ObjectTypes>
  invoked: boolean
  methods: string[]
  queue: any[]
  factory: (method: string) => () => ChordAnalytics
  load: () => void
  SNIPPET_VERSION: string
}

export class ChordAnalytics<T extends ObjectTypes = ObjectTypes> {
  /**
   * Allows snippet.js to detect whether this library has been initialized yet.
   */
  initialize: true = true

  /**
   * Allows snippet.js to detect whether the snippet has started running yet.
   */
  invoked: true = true

  /**
   * Options for ChordAnalytics.
   */
  options: ChordAnalyticsOptions<T>

  constructor(options: ChordAnalyticsOptions<T>) {
    const defaults = {
      debug: false,
      enableLogging: true,
      stripNull: true,
    }

    this.options = { ...defaults, ...options }
  }

  /*
   * Return the CDP instance provided in `options.cdp`.
   */
  cdp = (): AnyAnalytics => {
    const a = this.options?.cdp
    if (typeof a === 'function') return a()
    return a
  }

  /*
   * Log a message to the console if `options.enableLogging` is true.
   */
  logger = (message?: any, ...optionalParams: any[]): void => {
    if (!this.options.enableLogging) return
    // eslint-disable-next-line no-console
    console.log(message, ...optionalParams)
  }

  /**
   * Validate the body of a `track` event against the Chord tracking plan.
   */
  validate = (event: string, props: EventProperties): ValidateResult[] => {
    if (!event) {
      this.logger('No event name provided')
      return [{ success: false }]
    }
    const schema = event && eventSchemas[event]
    if (!schema) return [{ success: true, data: props }]
    return schema.map((s) => s.safeParse(props))
  }

  /**
   * Generate the event `meta` property.
   */
  meta = () => {
    return {
      ...this.options.metadata,
      ownership: {
        oms_id: this.options.metadata?.ownership?.omsId,
        store_id: this.options.metadata?.ownership?.storeId,
        tenant_id: this.options.metadata?.ownership?.tenantId,
      },
      version: {
        // TODO: make this dynamic
        major: 3,
        minor: 0,
        patch: 0,
      },
    }
  }

  /**
   * Send a `track` event to the CDP with any event name and properties.
   */
  track = (
    event: string,
    props?: EventProperties,
    options?: Options
  ): Promise<void> => {
    if (!event) this.logger('No event name provided')

    const formattedProps =
      this.options.stripNull && props ? pruneNullValues(props) : props

    const finalEventProps = {
      ...formattedProps,
      meta: this.meta(),
    }

    if (this.options.debug) {
      this.validate(event, finalEventProps).forEach((valid) => {
        if (!valid.success) {
          this.logger('Chord tracking plan violation', valid.error)
        }
      })
    }

    return new Promise((resolve) => {
      try {
        const a = this.cdp()
        if (a && typeof a.track === 'function') {
          a.track(event, finalEventProps, options, () => resolve())
        }
      } catch (error) {
        this.logger(error)
      }
    })
  }

  /**
   * Send an `identify` event to the CDP with user id and traits.
   */
  identify: {
    (userId?: string, traits?: IdentifyTraits, options?: AnyOptions): void
    (traits?: IdentifyTraits, options?: AnyOptions): void
  } = (...props) => {
    try {
      const a = this.cdp()
      if (a && typeof a.identify === 'function') {
        a.identify(...props)
      }
    } catch (error) {
      this.logger(error)
    }
  }

  /**
   * Send a `page` event to the CDP.
   */
  page: {
    (): void
  } = () => {
    try {
      const a = this.cdp()
      if (a && typeof a.page === 'function') {
        a.page({ meta: this.meta() })
      }
    } catch (error) {
      this.logger(error)
    }
  }

  reset = () => {
    try {
      const a = this.cdp()
      if (a && typeof a.reset === 'function') {
        a.reset()
      }
    } catch (error) {
      this.logger(error)
    }
  }

  // TODO: Add support for props.products
  trackCartViewed = async (
    props: CartViewedInput<T>,
    options?: AnyOptions
  ): Promise<void> => {
    const cart: Cart = this.options?.formatters?.objects?.cart?.({
      cart: props?.cart,
    })

    const payload: CartViewed = {
      cart_id: cart?.cart_id,
      currency: cart?.currency,
      products: cart?.products,
      value: cart?.value,
    }

    if (this.options?.formatters?.events?.cartViewed) {
      const formattedPayload = this.options?.formatters?.events?.cartViewed(
        props,
        payload
      )
      return this.track('Cart Viewed', formattedPayload, options)
    }

    return this.track('Cart Viewed', payload, options)
  }

  // TODO: Add support for props.products
  trackCheckoutStarted = async (
    props: CheckoutStartedInput<T>,
    options?: AnyOptions
  ): Promise<void> => {
    const formatter = this.options?.formatters?.events?.checkoutStarted
    const checkout = this.options?.formatters?.objects?.checkout?.({
      checkout: props?.checkout,
    })

    const payload: CheckoutStarted = checkout

    if (typeof formatter === 'function') {
      const formattedPayload = formatter(props, payload)
      return this.track('Checkout Started', formattedPayload, options)
    }

    return this.track('Checkout Started', payload, options)
  }

  trackCheckoutStepCompleted = async (
    props: CheckoutStepCompletedInput,
    options?: AnyOptions
  ): Promise<void> => {
    const formatter = this.options?.formatters?.events?.checkoutStepCompleted

    const payload: CheckoutStepCompleted = {
      checkout_id: props?.checkoutId,
      payment_method: props?.paymentMethod,
      shipping_method: props?.shippingMethod,
      step: props?.step,
    }

    if (typeof formatter === 'function') {
      const formattedPayload = formatter(props, payload)
      return this.track('Checkout Step Completed', formattedPayload, options)
    }

    return this.track('Checkout Step Completed', payload, options)
  }

  trackCheckoutStepViewed = async (
    props: CheckoutStepViewedInput,
    options?: AnyOptions
  ): Promise<void> => {
    const formatter = this.options?.formatters?.events?.checkoutStepViewed

    const payload: CheckoutStepViewed = {
      checkout_id: props?.checkoutId,
      payment_method: props?.paymentMethod,
      shipping_method: props?.shippingMethod,
      step: props?.step,
    }

    if (typeof formatter === 'function') {
      const formattedPayload = formatter(props, payload)
      return this.track('Checkout Step Viewed', formattedPayload, options)
    }

    return this.track('Checkout Step Viewed', payload, options)
  }

  trackCouponApplied = async (
    props: CouponAppliedInput,
    options?: AnyOptions
  ): Promise<void> => {
    const formatter = this.options?.formatters?.events?.couponApplied

    const payload: CouponApplied = {
      cart_id: props?.cartId,
      coupon_id: props?.couponId,
      coupon_name: props?.couponName,
      discount: props?.discount,
      order_id: props?.orderId,
    }

    if (typeof formatter === 'function') {
      const formattedPayload = formatter(props, payload)
      return this.track('Coupon Applied', formattedPayload, options)
    }

    return this.track('Coupon Applied', payload, options)
  }

  trackCouponDenied = async (
    props: CouponDeniedInput,
    options?: AnyOptions
  ): Promise<void> => {
    const formatter = this.options?.formatters?.events?.couponDenied

    const payload: CouponDenied = {
      cart_id: props?.cartId,
      coupon_id: props?.couponId,
      coupon_name: props?.couponName,
      order_id: props?.orderId,
      reason: props?.reason,
    }

    if (typeof formatter === 'function') {
      const formattedPayload = formatter(props, payload)
      return this.track('Coupon Denied', formattedPayload, options)
    }

    return this.track('Coupon Denied', payload, options)
  }

  trackCouponEntered = async (
    props: CouponEnteredInput,
    options?: AnyOptions
  ): Promise<void> => {
    const formatter = this.options?.formatters?.events?.couponEntered

    const payload: CouponEntered = {
      cart_id: props?.cartId,
      coupon_id: props?.couponId,
      coupon_name: props?.couponName,
      order_id: props?.orderId,
    }

    if (typeof formatter === 'function') {
      const formattedPayload = formatter(props, payload)
      return this.track('Coupon Entered', formattedPayload, options)
    }

    return this.track('Coupon Entered', payload, options)
  }

  trackCouponRemoved = async (
    props: CouponRemovedInput,
    options?: AnyOptions
  ): Promise<void> => {
    const formatter = this.options?.formatters?.events?.couponRemoved

    const payload: CouponRemoved = {
      cart_id: props?.cartId,
      coupon_id: props?.couponId,
      coupon_name: props?.couponName,
      discount: props?.discount,
      order_id: props?.orderId,
    }

    if (typeof formatter === 'function') {
      const formattedPayload = formatter(props, payload)
      return this.track('Coupon Removed', formattedPayload, options)
    }

    return this.track('Coupon Removed', payload, options)
  }

  trackEmailCaptured = async (
    props: EmailCapturedInput,
    options?: AnyOptions
  ): Promise<void> => {
    const formatter = this.options?.formatters?.events?.emailCaptured
    const payload: EmailCaptured = {
      email: props?.email,
      placement_component: props?.placementComponent,
      placement_page: props?.placementPage,
    }

    if (typeof formatter === 'function') {
      const formattedPayload = formatter(props, payload)
      return this.track('Email Captured', formattedPayload, options)
    }

    return this.track('Email Captured', payload, options)
  }

  trackProductAdded = async (
    props: ProductAddedInput<T>,
    options?: AnyOptions
  ): Promise<void> => {
    const formatter = this.options?.formatters?.events?.productAdded
    const product = this.options?.formatters?.objects?.product?.(props?.product)

    const cart = this.options?.formatters?.objects?.cart?.({
      cart: props?.cart,
    })

    const quantity = props?.product?.quantity || 1

    const payload: ProductAdded = {
      ...product,
      cart_id: cart.cart_id,
      currency: cart.currency,
      products: [{ ...product, quantity }], // TODO: add coupon
      total: product.price * (quantity || 1),
      value: product.price * (quantity || 1),
    }

    if (typeof formatter === 'function') {
      const formattedPayload = formatter(props, payload)
      return this.track('Product Added', formattedPayload, options)
    }

    return this.track('Product Added', payload, options)
  }

  trackProductClicked = async (
    props: ProductClickedInput<T>,
    options?: AnyOptions
  ): Promise<void> => {
    const formatter = this.options?.formatters?.events?.productClicked
    const product = this.options?.formatters?.objects?.product?.(props?.product)

    const cart = this.options?.formatters?.objects?.cart?.({
      cart: props?.cart,
    })

    const quantity = props?.product?.quantity || 1

    const payload: ProductClicked = {
      ...product,
      cart_id: cart.cart_id,
      currency: cart.currency,
      item_list_id: props?.listId?.toString(),
      item_list_name: props?.listName,
      products: [{ ...product, quantity }], // TODO: add coupon
    }

    if (typeof formatter === 'function') {
      const formattedPayload = formatter(props, payload)
      return this.track('Product Clicked', formattedPayload, options)
    }

    return this.track('Product Clicked', payload, options)
  }

  trackVariantClicked = async (
    props: VariantClickedInput<T>,
    options?: AnyOptions
  ): Promise<void> => {
    const formatter = this.options?.formatters?.events?.variantClicked
    const product = this.options?.formatters?.objects?.product?.(props?.product)

    const cart = this.options?.formatters?.objects?.cart?.({
      cart: props?.cart,
    })

    const quantity = props?.product?.quantity || 1

    const payload: VariantClicked = {
      ...product,
      cart_id: cart.cart_id,
      currency: cart.currency,
      quantity: quantity,
      line_item_id: props?.lineItemId,
      coupon: props?.coupon,
    }

    if (typeof formatter === 'function') {
      const formattedPayload = formatter(props, payload)
      return this.track('Variant Clicked', formattedPayload, options)
    }

    return this.track('Variant Clicked', payload, options)
  }

  trackProductListFiltered = async (
    props: ProductListFilteredInput,
    options?: AnyOptions
  ): Promise<void> => {
    const formatter = this.options?.formatters?.events?.productListFiltered

    const payload: ProductListFiltered = {
      category: props?.category,
      filters: props?.filters,
      list_id: props?.listId?.toString(),
      item_list_id: props?.listId?.toString(),
      item_list_name: props?.listName,
      sorts: props?.sorts,
    }

    if (typeof formatter === 'function') {
      const formattedPayload = formatter(props, payload)
      return this.track('Product List Filtered', formattedPayload, options)
    }

    return this.track('Product List Filtered', payload, options)
  }

  trackProductListViewed = async (
    props: ProductListViewedInput<T>,
    options?: AnyOptions
  ): Promise<void> => {
    const formatter = this.options?.formatters?.events?.productListViewed

    const payload: ProductListViewed = {
      category: props?.category,
      list_id: props?.listId?.toString(),
      item_list_id: props?.listId?.toString(),
      item_list_name: props?.listName,
      products: props?.products?.map((p, i) => {
        return this.options?.formatters?.objects?.product?.({
          ...p,
          position: i + 1,
        })
      }),
      value: 0, // TODO: remove from tracking plan
    }

    if (typeof formatter === 'function') {
      const formattedPayload = formatter(props, payload)
      return this.track('Product List Viewed', formattedPayload, options)
    }

    return this.track('Product List Viewed', payload, options)
  }

  trackProductRemoved = async (
    props: ProductRemovedInput<T>,
    options?: AnyOptions
  ): Promise<void> => {
    const formatter = this.options?.formatters?.events?.productRemoved
    /*
    const product = this.options?.formatters?.objects?.product?.({
      position: props?.position,
      product: props?.product,
      quantity: props?.quantity,
      variantId: props?.variantId,
    })
    */

    const lineItem = this.options?.formatters?.objects?.lineItem?.({
      lineItem: props?.lineItem,
    })

    const cart = this.options?.formatters?.objects?.cart?.({
      cart: props?.cart,
    })

    const payload: ProductRemoved = {
      ...lineItem,
      cart_id: cart.cart_id,
      currency: cart.currency,
      products: [lineItem],
      total: (lineItem?.price ?? 0) * (lineItem?.quantity ?? 1),
      value: (lineItem?.price ?? 0) * (lineItem?.quantity ?? 1),
    }

    if (typeof formatter === 'function') {
      const formattedPayload = formatter(props, payload)
      return this.track('Product Removed', formattedPayload, options)
    }

    return this.track('Product Removed', payload, options)
  }

  trackProductViewed = async (
    props: ProductViewedInput<T>,
    options?: AnyOptions
  ): Promise<void> => {
    const formatter = this.options?.formatters?.events?.productViewed
    const product = this.options?.formatters?.objects?.product?.(props?.product)
    const cart = this.options?.formatters?.objects?.cart?.({
      cart: props?.cart,
    })

    const quantity = props?.product?.quantity || 1

    const payload: ProductViewed = {
      ...product,
      cart_id: cart.cart_id,
      currency: cart.currency,
      products: [{ ...product, quantity }], // TODO: add coupon
      value: product.price * (props?.product?.quantity || 1),
    }

    if (typeof formatter === 'function') {
      const formattedPayload = formatter(props, payload)
      return this.track('Product Viewed', formattedPayload, options)
    }

    return this.track('Product Viewed', payload, options)
  }

  trackProductsSearched = async (
    props: ProductsSearchedInput,
    options?: AnyOptions
  ): Promise<void> => {
    const formatter = this.options?.formatters?.events?.productsSearched
    const payload: ProductsSearched = {
      currency: props?.currency,
      price:
        typeof props?.price !== 'undefined' ? Number(props?.price) : undefined,
      product_id: props?.productId?.toString(),
      quantity: props?.quantity,
      query: props?.query,
    }

    if (typeof formatter === 'function') {
      const formattedPayload = formatter(props, payload)
      return this.track('Products Searched', formattedPayload, options)
    }

    return this.track('Products Searched', payload, options)
  }

  trackSignedIn = async (
    props: SignedInInput,
    options?: AnyOptions
  ): Promise<void> => {
    const formatter = this.options?.formatters?.events?.signedIn

    const payload: SignedIn = {
      email: props?.email,
      method: props?.method,
    }

    if (typeof formatter === 'function') {
      const formattedPayload = formatter(props, payload)
      return this.track('Signed In', formattedPayload, options)
    }

    return this.track('Signed In', payload, options)
  }

  trackSignedOut = async (
    props?: SignedOutInput,
    options?: AnyOptions
  ): Promise<void> => {
    const formatter = this.options?.formatters?.events?.signedOut

    const payload: SignedOut = {
      email: props?.email,
    }

    if (typeof formatter === 'function') {
      const formattedPayload = formatter(props || {}, payload)
      return this.track('Signed Out', formattedPayload, options)
    }

    return this.track('Signed Out', payload, options)
  }

  trackSignedUp = async (
    props?: SignedUpInput,
    options?: AnyOptions
  ): Promise<void> => {
    const formatter = this.options?.formatters?.events?.signedUp

    const payload: SignedUp = {
      email: props?.email,
      method: props?.method,
    }

    if (typeof formatter === 'function') {
      const formattedPayload = formatter(props || {}, payload)
      return this.track('Signed Up', formattedPayload, options)
    }

    return this.track('Signed Up', payload, options)
  }

  trackLoginStarted = async (
    props: LoginStartedInput,
    options?: AnyOptions
  ): Promise<void> => {
    const formatter = this.options?.formatters?.events?.loginStarted

    const payload: LoginStarted = {
      email: props?.email,
    }

    if (typeof formatter === 'function') {
      const formattedPayload = formatter(props, payload)
      return this.track('Login Started', formattedPayload, options)
    }

    return this.track('Login Started', payload, options)
  }

  trackSubscriptionCancelled = async (
    props: SubscriptionCancelledInput,
    options?: AnyOptions
  ): Promise<void> => {
    const formatter = this.options?.formatters?.events?.subscriptionCancelled

    const payload: SubscriptionCancelled = {
      actionable_date: props?.actionableDate,
      address: props?.address,
      brand: props?.brand,
      email: props?.email,
      end_date: props?.endDate,
      interval_length: props?.intervalLength,
      interval_units: props?.intervalUnits,
      products: props?.products?.map((p, i) => {
        return this.options?.formatters?.objects?.product?.({
          ...p,
          position: i + 1,
        })
      }),
      state: props?.state,
      subscription_id: props?.subscriptionId,
      currency: props?.currency,
    }

    if (typeof formatter === 'function') {
      const formattedPayload = formatter(props || {}, payload)
      return this.track('Subscription Cancelled', formattedPayload, options)
    }

    return this.track('Subscription Cancelled', payload, options)
  }

  trackNavigationClicked = async (
    props: NavigationClickedInput,
    options?: AnyOptions
  ): Promise<void> => {
    const formatter = this.options?.formatters?.events?.navigationClicked

    const payload: NavigationClicked = {
      category: props?.category,
      label: props?.label,
      navigation_placement: props?.navigationPlacement,
      navigation_title: props?.navigationTitle,
      navigation_url: props?.navigationUrl,
    }

    if (typeof formatter === 'function') {
      const formattedPayload = formatter(props, payload)
      return this.track('Navigation Clicked', formattedPayload, options)
    }

    return this.track('Navigation Clicked', payload, options)
  }

  trackPaymentInfoEntered = async (
    props: PaymentInfoEnteredInput,
    options?: AnyOptions
  ): Promise<void> => {
    const formatter = this.options?.formatters?.events?.paymentInfoEntered

    const payload: PaymentInfoEntered = {
      checkout_id: props?.checkoutId,
      coupon: props?.coupon,
      currency: props?.currency,
      order_id: props?.orderId,
      payment_method: props?.paymentMethod,
      products: props?.products?.map((p, i) => {
        return this.options?.formatters?.objects?.product?.({
          ...p,
          position: i + 1,
        })
      }),
      shipping_method: props?.shippingMethod,
      step: props?.step,
      value: props?.value,
    }

    if (typeof formatter === 'function') {
      const formattedPayload = formatter(props, payload)
      return this.track('Payment Info Entered', formattedPayload, options)
    }

    return this.track('Payment Info Entered', payload, options)
  }
}
