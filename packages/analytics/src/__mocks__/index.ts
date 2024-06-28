import type { AnyAnalytics, ChordAnalyticsOptions } from '../types/index.js'
import {
  mockCartFormatter,
  mockCheckoutFormatter,
  mockLineItemFormatter,
  mockProductFormatter,
} from './formatters.js'

export * from './objects.js'
export * from './formatters.js'

export const mockCDP = {
  identify: jest.fn(),
  track: jest.fn(),
}

export const mockChordOptions: ChordAnalyticsOptions = {
  cdp: mockCDP as unknown as AnyAnalytics,
  formatters: {
    objects: {
      cart: mockCartFormatter,
      checkout: mockCheckoutFormatter,
      lineItem: mockLineItemFormatter,
      product: mockProductFormatter,
    },
  },
  metadata: {
    i18n: {
      currency: 'USD',
      locale: 'en-US',
    },
    ownership: {
      omsId: 'omsId',
      storeId: 'storeId',
      tenantId: 'tenantId',
    },
    platform: {
      name: 'chord',
      type: 'web',
    },
    store: {
      domain: 'chord.com',
    },
  },
}

export const mockMeta = {
  i18n: {
    currency: 'USD',
    locale: 'en-US',
  },
  ownership: {
    oms_id: 'omsId',
    store_id: 'storeId',
    tenant_id: 'tenantId',
  },
  platform: {
    name: 'chord',
    type: 'web',
  },
  store: {
    domain: 'chord.com',
  },
  version: {
    major: 3,
    minor: 0,
    patch: 0,
  },
}
