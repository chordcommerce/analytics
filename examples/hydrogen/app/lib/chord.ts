import {
  ChordAnalytics,
  LineItemFormatter,
  CartFormatter,
  CheckoutFormatter,
  ProductFormatter,
} from '@chordcommerce/analytics';
import {AnalyticsBrowser} from '@segment/analytics-next';
import {
  parseGid,
  CollectionViewPayload,
  ProductViewPayload,
} from '@shopify/hydrogen';
import type {
  Cart,
  CartLine,
  ComponentizableCartLine,
} from '@shopify/hydrogen/storefront-api-types';

import {withShopifyCustomerPrivacy} from './segment-consent-wrapper';

export type ProductPayload = {
  /** The product id. */
  id: string;
  /** The product title. */
  title: string;
  /** The displaying variant price. */
  price: string;
  /** The product vendor. */
  vendor: string;
  /** The displaying variant id. */
  variantId: string;
  /** The displaying variant title. */
  variantTitle: string;
  /** The quantity of product. */
  quantity: number;
  /** The product sku. */
  sku?: string | null;
  /** The product type. */
  productType?: string;
};

type PromoCodePayload = {
  cart: Cart;
  customData: {
    promoCode: string;
  };
};

export type PromoCodeApplyPayload = PromoCodePayload;

export type PromoCodeEnterPayload = PromoCodePayload;

export type PromoCodeRemovePayload = PromoCodePayload;

export type PromoCodeDenyPayload = PromoCodePayload & {
  customData: {
    reason: string;
  };
};

export type AccountViewPayload = {
  customData: {
    customer: {
      id: string;
      emailAddress?: {
        emailAddress?: string;
      };
      firstName?: string;
      lastName?: string;
      phoneNumber?: {
        phoneNumber?: string;
      };
    };
  };
};

export type EmailSubscribePayload = {
  customData: {
    email: string;
    placementComponent?: string;
    placementPage?: string;
  };
};

export type PhoneSubscribePayload = {
  customData: {
    phone: string;
  };
};

export type ProductClickPayload = {
  cart: Cart;
  customData: {
    listId?: string;
    listName?: string;
    products: ProductPayload[];
  };
};
export type CustomCollectionViewPayload = {
  customData: {
    products: ProductPayload[];
  };
} & CollectionViewPayload;

export type CollectionFilterPayload = {
  customData: {
    filters: {key?: string; value?: string}[];
    sorts: {key?: string; value?: string}[];
  };
} & CollectionViewPayload;

export type CustomProductViewPayload = {
  cart: Cart;
} & ProductViewPayload;

/**
 * Transforms Hydrogen's `ProductPayload` type into Chord's `Product` type.
 * https://github.com/Shopify/hydrogen/blob/main/packages/hydrogen/src/analytics-manager/AnalyticsView.tsx#L34-L53
 */
const productFormatter: ProductFormatter<ProductPayload> = ({
  position,
  product,
  quantity,
  variantId,
}) => {
  if ('merchandise' in product && product.merchandise) {
    return lineItemFormatter({lineItem: product as unknown as CartLine});
  }

  return {
    brand: product?.vendor,
    category: product?.productType,
    name: product?.title,
    position,
    price: Number(product?.price) || 0,
    product_id: parseGid(product?.id)?.id,
    quantity,
    sku: product?.sku || '',
    variant: product?.variantTitle,
    variant_id: parseGid(variantId?.toString())?.id,
  };
};

/**
 * Transforms Hydrogen's `CartLine` type into Chord's `LineItem` type.
 * https://github.com/Shopify/hydrogen/blob/main/packages/hydrogen-react/src/storefront-api-types.d.ts#L1124-L1152
 */
const lineItemFormatter: LineItemFormatter<
  CartLine | ComponentizableCartLine
> = ({lineItem}) => {
  const discount = lineItem?.discountAllocations?.find(
    ({discountedAmount}) => Number(discountedAmount?.amount) > 0,
  );

  const coupon =
    (discount && 'code' in discount && discount?.code) ||
    (discount && 'title' in discount && discount?.title) ||
    undefined;

  return {
    brand: lineItem?.merchandise?.product?.vendor,
    category: lineItem?.merchandise?.product?.productType,
    coupon,
    image_url: lineItem?.merchandise?.image?.url,
    line_item_id: parseGid(lineItem?.id)?.id || undefined,
    name: lineItem?.merchandise?.product?.title,
    option_values: lineItem?.merchandise?.selectedOptions?.map(
      ({name, value}) => `${name}${value}`,
    ),
    price: Number(lineItem?.cost?.amountPerQuantity?.amount) || 0,
    product_id: parseGid(lineItem?.merchandise?.product?.id)?.id,
    quantity: lineItem?.quantity,
    sku: lineItem?.merchandise?.sku || '',
    slug: lineItem?.merchandise?.product?.handle,
    variant: lineItem?.merchandise?.title,
    variant_id: parseGid(lineItem?.merchandise?.id)?.id,
  };
};

/**
 * Transforms Hydrogen's `Cart` type into Chord's `Cart` type.
 * https://github.com/Shopify/hydrogen/blob/main/packages/hydrogen-react/src/cart-types.ts#L69
 */
const cartFormatter: CartFormatter<Cart> = ({cart}) => {
  const discount = cart?.discountAllocations?.find(
    ({discountedAmount}) => Number(discountedAmount?.amount) > 0,
  );

  return {
    cart_id: parseGid(cart?.id)?.id || undefined,
    currency: cart?.cost?.totalAmount?.currencyCode,
    products: cart?.lines?.edges?.map(({node}, i) => {
      const item = lineItemFormatter({lineItem: node});
      const coupon =
        item.coupon ||
        (discount && 'code' in discount && discount.code) ||
        (discount && 'title' in discount && discount.title) ||
        undefined;

      return {
        ...item,
        coupon,
        position: i + 1,
      };
    }),
    value: Number(cart?.cost?.totalAmount?.amount) || 0,
  };
};

/**
 * Unused.
 */
const checkoutFormatter: CheckoutFormatter = ({checkout}) => checkout;

export type CreateChordClientProps = {
  currency: string;
  domain: string;
  locale: string;
  omsId: string;
  segmentWriteKey: string;
  storeId: string;
  tenantId: string;
};

const createCDP = (writeKey: string) => {
  console.log(typeof window);
  if (typeof window === 'undefined') {
    return;
  }

  const cdp = new AnalyticsBrowser();
  withShopifyCustomerPrivacy(cdp).load({
    writeKey,
  });
  return cdp;
};

export const createChordClient = ({
  currency,
  domain,
  locale,
  omsId,
  segmentWriteKey,
  storeId,
  tenantId,
}: CreateChordClientProps) => {
  const cdp = createCDP(segmentWriteKey);

  return new ChordAnalytics<{
    Cart: Cart;
    Checkout: unknown;
    LineItem: CartLine | ComponentizableCartLine;
    Product: ProductPayload;
  }>({
    cdp,
    formatters: {
      objects: {
        cart: cartFormatter,
        checkout: checkoutFormatter,
        lineItem: lineItemFormatter,
        product: productFormatter,
      },
    },
    metadata: {
      i18n: {
        currency,
        locale,
      },
      ownership: {
        omsId,
        storeId,
        tenantId,
      },
      platform: {
        name: 'Shopify',
        type: 'web',
      },
      store: {
        domain,
      },
    },
  });
};
