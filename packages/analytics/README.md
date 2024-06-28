# @chordcommerce/analytics

The `@chordcommerce/analytics` library provides simple methods for sending tracking events to Chord from your website, with an optional debugging mode to validate event properties.

`@chordcommerce/analytics` is intended to be installed alongside a customer data platform (CDP) tracking library like Segment's [analytics.js](https://www.npmjs.com/package/@segment/analytics-next). `@chordcommerce/analytics` sends Chord tracking events to the CDP tracking library, so they’re available for all connected integrations.

Visit [docs.chord.co](https://docs.chord.co/analytics-getting-started) for guides, examples, and an API reference.

## Requirements

A CDP Javascript library must be installed in your project. Currently, only Segment's [analytics.js](https://www.npmjs.com/package/@segment/analytics-next) library is supported.

## Installation

To install `@chordcommerce/analytics`, run the following command in your project directory:

```bash
npm install @chordcommerce/analytics
# or
yarn add @chordcommerce/analytics
```

## Usage

First, ensure that a CDP Javascript library is installed and configured in your project. Then, initialize `@chordcommerce/analytics` as follows:

```jsx
import ChordAnalytics from '@chordcommerce/analytics'

const chord = new ChordAnalytics(options) // see below for configuration options

chord.trackCartViewed({ cart }) // sends a "Cart Viewed" event to the CDP
```

## Configuration

`@chordcommerce/analytics` can be initialized with the following options:

| Property        | Required | Description                                                                                                                                                                                                                                                                                                      |
| --------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cdp`           | true     | A reference to the CDP library, or a function that returns a reference to the CDP library. For example, if using Segment's [analytics.js](https://www.npmjs.com/package/@segment/analytics-next) library, this could be `window.analytics` or `() => window.analytics`. If omitted, no tracking events are sent. |
| `debug`         | false    | Defaults to `false`. When set to `true`, events are validated against Chord's tracking plan and errors are logged. We recommend enabling this for development and disabling for production.                                                                                                                      |
| `enableLogging` | false    | Defaults to `true`. When set to `true`, errors are logged using `console.log`.                                                                                                                                                                                                                                   |
| `formatters`    | true     | Functions that are used to construct tracking events. There are two types of formatters, objects and events. `formatters.objects` is required. See below for details.                                                                                                                                            |
| `metadata`      | true     | Event metadata. See below for details.                                                                                                                                                                                                                                                                           |
| `stripNull`     | false    | Defaults to `true`. When set to `true`, event properties with a `null` value are removed. CDPs typically treat `null` and `undefined` as separate values, so be sure you intend to send `null` values before setting to false.                                                                                   |

**Metadata**

| Property                      | Required | Description                                                                                                                       |
| ----------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `metadata.i18n.currency`      | true     | The order currency in ISO 4217 currency code, uppercase. For example, `USD`.                                                      |
| `metadata.i18n.locale`        | true     | The order locale. For example, `en-US`.                                                                                           |
| `metadata.ownership.omsId`    | true     | A UUID assigned by Chord.                                                                                                         |
| `metadata.ownership.storeId`  | true     | A UUID assigned by Chord.                                                                                                         |
| `metadata.ownership.tenantId` | true     | A UUID assigned by Chord.                                                                                                         |
| `metadata.platform.name`      | true     | The e-commerce platform used. For example, `Shopify`.                                                                             |
| `metadata.platform.type`      | true     | The type of platform where the event originated. Either `web` or `pos`.                                                           |
| `metadata.store.domain`       | true     | The domain of the site where the event originated. For Shopify, this should be the store slug that comes before `.myshopify.com`. |

### Formatters

Formatters are Javascript functions that are used to construct tracking event properties. There are two types of formatters, objects and events. You must define object formatters. Event formatters are optional. See [Chord’s documentation](https://docs.chord.co/analytics-getting-started#fgWx7) for more details and example formatters.

**Object Formatters**

A formatter must be provided for each of the four core data types that are used in Chord events. This formatter function transforms input data into the type Chord expects. See [Chord’s documentation](https://docs.chord.co/analytics-getting-started#XhUB5) for more details on object formatters.

| Property                      | Required | Description                                 |
| ----------------------------- | -------- | ------------------------------------------- |
| `formatters.objects.cart`     | true     | A function that creates a cart object.      |
| `formatters.objects.checkout` | true     | A function that creates a checkout object.  |
| `formatters.objects.lineItem` | true     | A function that creates a line item object. |
| `formatters.objects.product`  | true     | A function that creates a product object.   |

**Event Formatters**

A formatter can be provided for each event. This formatter is used to transform the event properties of a specific event after Chord constructs the event, just before it's sent to the CDP. See [Chord’s documentation](https://docs.chord.co/analytics-getting-started#jquZe) for more details on event formatters.

## Using with Typescript

Optionally, you can instantiate `ChordAnalytics` with a custom type argument describing your data to improve type safety for formatters and SDK functions.

For instance, if you're working with objects like `cart`, `product`, etc., from a Shopify storefront API query, you might already have types like `StorefrontCart` defined for the response. Instantiate `ChordAnalytics` with a type argument:

```js
interface ObjectTypes {
  Cart: StorefrontCart
  Checkout: StorefrontCart
  LineItem: StorefrontLineItem
  Product: StorefrontProduct
}

const chord = new ChordAnalytics<ObjectTypes>({ options })
```

Now, when you use an SDK method like `chord.trackCartViewed({ cart })`, `cart` has the `StorefrontCart` type.

Formatter types also support an optional generic type parameter for the function argument:

```js
import type { CartFormatter } from '@chordcommerce/analytics'

export const cartFormatter: CartFormatter<StorefrontCart> = (props) => {
  const { cart } = props // `cart` has type `StorefrontCart`
  return { ... }
}
```

## API Reference

See [Chord’s documentation](https://docs.chord.co/analytics-getting-started) for a full API reference.

## Support

For support with setup and configuration, please contact Chord directly at **help@chord.co**.
