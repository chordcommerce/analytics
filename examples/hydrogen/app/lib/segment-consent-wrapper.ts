import {
  AnyAnalytics,
  IntegrationCategoryMappings,
  createWrapper,
  resolveWhen,
} from '@segment/analytics-consent-tools'
import { CustomerPrivacy } from '@shopify/hydrogen'

/**
 * Returns a reference to the global Shopify Customer Privacy API object.
 */
const getShopifyGlobal = () => {
  return window.Shopify?.customerPrivacy
}

/**
 * Returns an object representing the current consent state. Shopify says:
 * To check what processing is allowed, use the `Allowed` methods. These methods combine the following factors to determine what processing is allowed:
 * - The current merchant settings: Is consent required in this region?
 * - User location: Is the customer in a region where consent is required?
 * - User consent given: Did the customer give consent for a specific purpose?
 */
const getCurrentConsent = () => {
  const Shopify: CustomerPrivacy = getShopifyGlobal()
  return {
    analytics: Shopify?.analyticsProcessingAllowed() || false,
    marketing: Shopify?.marketingAllowed() || false,
    preferences: Shopify?.preferencesProcessingAllowed() || false,
    sale_of_data: Shopify?.saleOfDataAllowed() || false,
  }
}

/**
 * Returns a boolean indicating whether the user has given consent to be tracked.
 * This is determined by the `analyticsProcessingAllowed` and `marketingAllowed` methods.
 */
const userCanBeTracked = () => {
  const Shopify = getShopifyGlobal()
  if (!Shopify) return false
  return !!(Shopify.analyticsProcessingAllowed() && Shopify.marketingAllowed())
}

/**
 *
 * @param analyticsInstance - An analytics instance. Either `window.analytics`, or the instance returned by `new AnalyticsBrowser()` or `AnalyticsBrowser.load({...})`
 * @param settings - Optional settings for configuring your Shopify Customer Privacy API wrapper
 */
export const withShopifyCustomerPrivacy = (
  analyticsInstance: AnyAnalytics,
  settings?: {
    disableConsentChangedEvent: boolean
    integrationCategoryMappings: IntegrationCategoryMappings
  }
) => {
  return createWrapper({
    shouldLoadWrapper: async () => {
      await resolveWhen(() => getShopifyGlobal() !== undefined, 500)
    },

    shouldLoadSegment: async () => {
      await resolveWhen(userCanBeTracked, 1000)
    },

    getCategories: getCurrentConsent,

    registerOnConsentChanged: settings?.disableConsentChangedEvent
      ? undefined
      : (setCategories) => {
          document.addEventListener('visitorConsentCollected', async () => {
            setCategories(getCurrentConsent())
          })
        },

    integrationCategoryMappings: settings?.integrationCategoryMappings,
  })(analyticsInstance)
}
