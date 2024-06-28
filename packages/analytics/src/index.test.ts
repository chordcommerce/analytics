import {
  CartViewed,
  ChordAnalytics,
  EmailCaptured,
  PaymentInfoEntered,
  NavigationClicked,
  SubscriptionCancelled,
  LoginStarted,
  VariantClicked,
  CheckoutStepCompleted,
  CheckoutStepViewed,
} from './index.js'
import {
  mockChordOptions,
  mockCDP,
  mockCart,
  mockProduct,
  mockMeta,
  mockAddress,
  MockCart,
  MockCheckout,
  MockLineItem,
  MockProduct,
} from './__mocks__/index.js'

interface ObjectTypes {
  Cart: MockCart
  Checkout: MockCheckout
  LineItem: MockLineItem
  Product: MockProduct
}

describe('@chordcommerce/chord-analytics', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should export ChordAnalytics', () => {
    expect(ChordAnalytics).toBeDefined()
    const analytics = new ChordAnalytics(mockChordOptions)
    expect(analytics.options).toMatchObject({ debug: false })
  })

  const expectedProductAttributes = {
    affiliation: 'Mocked Affiliation',
    brand: 'Mocked Brand',
    bundle: true,
    category: 'Mocked Category',
    description: 'Mocked Description',
    image_url: 'http://example.com/mock.jpg',
    name: 'Mocked Product',
    option_values: ['Mocked Option 1', 'Mocked Option 2'],
    position: 1,
    price: 99.99,
    product_id: 'mockedProductId',
    sku: 'mockedSku',
    slug: 'mocked-product',
    url: 'http://example.com/mock-product',
    variant: 'Mocked Variant',
  }

  describe('trackCartViewed', () => {
    it('sends the correct event to the CDP', () => {
      const chord = new ChordAnalytics<ObjectTypes>(mockChordOptions)

      chord.trackCartViewed({ cart: mockCart })

      const expected: Required<CartViewed> = {
        cart_id: 'mockedCartId',
        currency: 'USD',
        meta: mockMeta,
        products: [
          {
            ...expectedProductAttributes,
            line_item_id: 'mockedLineItemId',
            coupon: 'mockedCoupon',
            quantity: 1,
          },
        ],
        value: 100,
      }

      expect(mockCDP.track).toHaveBeenCalledWith(
        'Cart Viewed',
        expected,
        undefined,
        expect.any(Function)
      )
    })
  })

  describe('trackEmailCaptured', () => {
    it('sends the correct event to the CDP', () => {
      const chord = new ChordAnalytics<ObjectTypes>(mockChordOptions)

      chord.trackEmailCaptured({
        email: 'test@test.com',
        placementComponent: 'footer',
        placementPage: 'home',
      })

      const expected: Required<EmailCaptured> = {
        email: 'test@test.com',
        placement_component: 'footer',
        placement_page: 'home',
        meta: mockMeta,
      }

      expect(mockCDP.track).toHaveBeenCalledWith(
        'Email Captured',
        expected,
        undefined,
        expect.any(Function)
      )
    })
  })

  describe('trackPaymentInfoEntered', () => {
    it('sends the correct event to the CDP', () => {
      const chord = new ChordAnalytics<ObjectTypes>(mockChordOptions)

      chord.trackPaymentInfoEntered({
        checkoutId: 'checkout_123',
        coupon: 'COUPON_CODE',
        currency: 'USD',
        orderId: 'order_123',
        paymentMethod: 'credit_card',
        products: [{ product: mockProduct }],
        shippingMethod: 'standard',
        step: 1,
        value: 100,
      })

      const expected: Required<PaymentInfoEntered> = {
        checkout_id: 'checkout_123',
        coupon: 'COUPON_CODE',
        currency: 'USD',
        order_id: 'order_123',
        payment_method: 'credit_card',
        products: [expectedProductAttributes],
        shipping_method: 'standard',
        step: 1,
        value: 100,
        meta: mockMeta,
      }

      expect(mockCDP.track).toHaveBeenCalledWith(
        'Payment Info Entered',
        expected,
        undefined,
        expect.any(Function)
      )
    })
  })

  describe('trackNavigationClicked', () => {
    it('sends the correct event to the CDP', () => {
      const chord = new ChordAnalytics<ObjectTypes>(mockChordOptions)

      chord.trackNavigationClicked({
        category: 'main',
        label: 'Home',
        navigationPlacement: 'header',
        navigationTitle: 'Main Navigation',
        navigationUrl: '/home',
      })

      const expected: Required<NavigationClicked> = {
        category: 'main',
        label: 'Home',
        navigation_placement: 'header',
        navigation_title: 'Main Navigation',
        navigation_url: '/home',
        meta: mockMeta,
      }

      expect(mockCDP.track).toHaveBeenCalledWith(
        'Navigation Clicked',
        expected,
        undefined,
        expect.any(Function)
      )
    })
  })

  describe('trackSubscriptionCancelled', () => {
    it('sends the correct event to the CDP', () => {
      const chord = new ChordAnalytics<ObjectTypes>(mockChordOptions)

      chord.trackSubscriptionCancelled({
        actionableDate: '2023-06-01',
        address: mockAddress,
        brand: 'Acme',
        email: 'john@example.com',
        endDate: '2023-12-31',
        intervalLength: 1,
        intervalUnits: 'month',
        products: [{ product: mockProduct }],
        state: 'active',
        subscriptionId: 'sub_123',
        currency: 'USD',
      })

      const expected: Required<SubscriptionCancelled> = {
        actionable_date: '2023-06-01',
        address: mockAddress,
        brand: 'Acme',
        email: 'john@example.com',
        end_date: '2023-12-31',
        interval_length: 1,
        interval_units: 'month',
        products: [expectedProductAttributes],
        state: 'active',
        subscription_id: 'sub_123',
        meta: mockMeta,
        currency: 'USD',
      }

      expect(mockCDP.track).toHaveBeenCalledWith(
        'Subscription Cancelled',
        expected,
        undefined,
        expect.any(Function)
      )
    })
  })

  describe('trackLoginStarted', () => {
    it('sends the correct event to the CDP', () => {
      const chord = new ChordAnalytics<ObjectTypes>(mockChordOptions)

      chord.trackLoginStarted({
        email: 'test@example.com',
      })

      const expected: Required<LoginStarted> = {
        email: 'test@example.com',
        meta: mockMeta,
      }

      expect(mockCDP.track).toHaveBeenCalledWith(
        'Login Started',
        expected,
        undefined,
        expect.any(Function)
      )
    })
  })

  describe('trackVariantClicked', () => {
    it('sends the correct event to the CDP', () => {
      const chord = new ChordAnalytics<ObjectTypes>(mockChordOptions)

      chord.trackVariantClicked({
        product: {
          product: mockProduct,
          position: 1,
          variantId: 'variant_123',
        },
        cart: mockCart,
        lineItemId: 'line_item_123',
        coupon: 'COUPON_CODE',
      })

      const expected: Required<VariantClicked> = {
        ...expectedProductAttributes,
        cart_id: 'mockedCartId',
        currency: 'USD',
        quantity: 1,
        line_item_id: 'line_item_123',
        coupon: 'COUPON_CODE',
        variant_id: 'variant_123',
        meta: mockMeta,
      }

      expect(mockCDP.track).toHaveBeenCalledWith(
        'Variant Clicked',
        expected,
        undefined,
        expect.any(Function)
      )
    })
  })

  describe('trackCheckoutStepViewed', () => {
    it('sends the correct event to the CDP', () => {
      const chord = new ChordAnalytics<ObjectTypes>(mockChordOptions)

      chord.trackCheckoutStepViewed({
        checkoutId: 'checkout_123',
        step: 1,
        paymentMethod: 'credit_card',
        shippingMethod: 'standard',
      })

      const expected: Required<CheckoutStepViewed> = {
        checkout_id: 'checkout_123',
        step: 1,
        payment_method: 'credit_card',
        shipping_method: 'standard',
        meta: mockMeta,
      }

      expect(mockCDP.track).toHaveBeenCalledWith(
        'Checkout Step Viewed',
        expected,
        undefined,
        expect.any(Function)
      )
    })
  })

  describe('trackCheckoutStepViewed', () => {
    it('sends the correct event to the CDP', () => {
      const chord = new ChordAnalytics<ObjectTypes>(mockChordOptions)

      chord.trackCheckoutStepCompleted({
        checkoutId: 'checkout_123',
        step: 1,
        paymentMethod: 'credit_card',
        shippingMethod: 'standard',
      })

      const expected: Required<CheckoutStepCompleted> = {
        checkout_id: 'checkout_123',
        payment_method: 'credit_card',
        shipping_method: 'standard',
        step: 1,
        meta: mockMeta,
      }

      expect(mockCDP.track).toHaveBeenCalledWith(
        'Checkout Step Completed',
        expected,
        undefined,
        expect.any(Function)
      )
    })
  })
})
