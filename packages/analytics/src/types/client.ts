import type {
  AnalyticsSnippet,
  Analytics,
  AnalyticsBrowser,
  Options,
} from '@segment/analytics-next'

import { ChordAnalyticsFormatters } from './formatters.js'

export interface ValidateResult {
  success: boolean
  error?: any[]
  data?: any
}

export interface ObjectTypes {
  Cart: any
  Checkout: any
  LineItem: any
  Product: any
}

export type AnyAnalytics = AnalyticsSnippet | Analytics | AnalyticsBrowser

export type AnyOptions = Options

export type AnyProduct = {
  [key: string]: unknown
}

export type AnyCart = {
  [key: string]: unknown
}

export type AnyCheckout = {
  [key: string]: unknown
}

export type AnyId = string | number

export type AnyLineItem = {
  [key: string]: unknown
}

export interface ChordAnalyticsOptions<T extends ObjectTypes = ObjectTypes> {
  cdp?: AnyAnalytics | (() => AnyAnalytics)
  debug?: boolean
  enableLogging?: boolean
  formatters: ChordAnalyticsFormatters<T>
  stripNull?: boolean
  metadata: EventMetadata
}

export interface EventMetadata {
  i18n: i18nMetadata
  ownership: ownershipMetadata
  platform: platformMetadata
  store: storeMetadata
  version?: versionMetadata
}

export interface i18nMetadata {
  currency: string
  locale: string
}

export interface ownershipMetadata {
  omsId: string
  storeId: string
  tenantId: string
}

export interface platformMetadata {
  name: string
  type: string
}

export interface versionMetadata {
  major: number
  minor: number
  patch: number
}

export interface storeMetadata {
  domain: string
}
