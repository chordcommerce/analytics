import {useAnalytics, parseGid} from '@shopify/hydrogen';
import {useEffect, useMemo} from 'react';

import {
  createChordClient,
  CreateChordClientProps,
  PromoCodeApplyPayload,
  PromoCodeDenyPayload,
  PromoCodeEnterPayload,
  PromoCodeRemovePayload,
  AccountViewPayload,
  EmailSubscribePayload,
  PhoneSubscribePayload,
  ProductClickPayload,
  ProductPayload,
  CustomCollectionViewPayload,
  CollectionFilterPayload,
  CustomProductViewPayload,
} from '../lib/chord';

export function ChordAnalytics({
  currency,
  domain,
  locale,
  omsId,
  segmentWriteKey,
  storeId,
  tenantId,
}: CreateChordClientProps) {
  const {subscribe} = useAnalytics();

  const chord = useMemo(() => {
    return createChordClient({
      currency,
      domain,
      locale,
      omsId,
      segmentWriteKey,
      storeId,
      tenantId,
    });
  }, []);

  useEffect(() => {
    // Standard events
    subscribe('page_viewed', () => {
      chord.page();
    });

    subscribe('cart_viewed', (data) => {
      const {cart} = data;
      if (!cart) return;
      chord.trackCartViewed({cart});
    });

    subscribe('product_viewed', (data) => {
      const {cart, products} = data as CustomProductViewPayload;
      const product = products?.[0];
      if (!product) return;

      chord.trackProductViewed({
        cart,
        product: {
          product,
          quantity: product.quantity,
          variantId: product.variantId,
        },
      });
    });

    subscribe('collection_viewed', (data) => {
      const {collection, customData} = data as CustomCollectionViewPayload;
      if (!collection) return;
      const {products} = customData || {};

      chord.trackProductListViewed({
        listId: parseGid(collection.id)?.id,
        listName: collection.handle,
        products: products.map((product) => ({
          product,
          quantity: product.quantity,
          variantId: product.variantId,
        })),
      });
    });

    subscribe('search_viewed', (data) => {
      const {searchTerm} = data;
      if (!searchTerm) return;

      chord.trackProductsSearched({query: searchTerm});
    });

    subscribe('cart_updated', (data) => {
      const {prevCart, cart} = data;
      if (!cart || !prevCart) return;

      const variantIdsInCart = cart.lines.edges.map(
        (line) => line.node.merchandise.id,
      );
      const variantIdsInPrevCart = prevCart.lines.edges.map(
        (line) => line.node.merchandise.id,
      );
      const uniqueVariantIdsInCart = [...new Set(variantIdsInCart)];
      const uniqueVariantIdsInPrevCart = [...new Set(variantIdsInPrevCart)];

      const isAdd =
        uniqueVariantIdsInCart.length > uniqueVariantIdsInPrevCart.length;

      if (uniqueVariantIdsInCart.length === uniqueVariantIdsInPrevCart.length)
        return;

      if (isAdd) {
        const currentLine = cart.lines.edges[0]?.node;
        chord.trackProductAdded({
          cart,
          product: {
            product: currentLine as unknown as ProductPayload,
            quantity: currentLine.quantity,
            variantId: parseGid(currentLine.merchandise?.id)?.id,
          },
        });
      } else {
        const prevLine = prevCart.lines.edges[0]?.node;
        chord.trackProductRemoved({
          cart,
          lineItem: prevLine,
        });
      }
    });

    subscribe('custom_promo_code_denied', (data) => {
      const {cart, customData} = data as unknown as PromoCodeDenyPayload;
      chord.trackCouponDenied({
        cartId: parseGid(cart?.id)?.id,
        couponName: customData?.promoCode,
        reason: customData?.reason,
      });
    });

    subscribe('custom_promo_code_applied', (data) => {
      const {cart, customData} = data as unknown as PromoCodeApplyPayload;
      chord.trackCouponApplied({
        cartId: parseGid(cart?.id)?.id,
        couponName: customData?.promoCode,
      });
    });

    subscribe('custom_promo_code_entered', (data) => {
      const {cart, customData} = data as unknown as PromoCodeEnterPayload;
      chord.trackCouponEntered({
        cartId: parseGid(cart?.id)?.id,
        couponName: customData?.promoCode,
      });
    });

    subscribe('custom_promo_code_removed', (data) => {
      const {cart, customData} = data as unknown as PromoCodeRemovePayload;
      chord.trackCouponRemoved({
        cartId: parseGid(cart?.id)?.id,
        couponName: customData?.promoCode,
      });
    });

    subscribe('custom_account_viewed', (data) => {
      const {customData} = data as unknown as AccountViewPayload;
      const {customer} = customData || {};
      if (!customer) return;

      chord.identify(parseGid(customer.id)?.id, {
        email: customer.emailAddress?.emailAddress || undefined,
        firstName: customer.firstName || undefined,
        lastName: customer.lastName || undefined,
        phone: customer.phoneNumber?.phoneNumber || undefined,
      });
    });

    subscribe('custom_email_subscribed', (data) => {
      const {customData} = data as unknown as EmailSubscribePayload;
      if (!customData) return;

      chord.identify({
        email: customData.email,
      });

      chord.trackEmailCaptured({
        email: customData.email,
        placementComponent: customData.placementComponent,
        placementPage: customData.placementPage,
      });
    });

    subscribe('custom_phone_subscribed', (data) => {
      const {customData} = data as unknown as PhoneSubscribePayload;
      if (!customData) return;

      chord.identify({
        phone: customData.phone,
      });
    });

    subscribe('custom_product_clicked', (data) => {
      const {cart, customData} = data as unknown as ProductClickPayload;
      const {listId, listName, products} = customData || {};
      const product = products?.[0];
      if (!product) return;

      chord.trackProductClicked({
        cart,
        listId,
        listName,
        product: {
          product,
          quantity: product.quantity,
          variantId: product.variantId,
        },
      });
    });

    subscribe('custom_collection_filtered', (data) => {
      const {collection, customData} = data as CollectionFilterPayload;
      const {filters, sorts} = customData || {};

      chord.trackProductListFiltered({
        listId: parseGid(collection?.id)?.id,
        listName: collection?.handle,
        filters: filters?.map((filter) => ({
          type: filter?.key,
          value: filter?.value,
        })),
        sorts: sorts?.map((sort) => ({
          type: sort?.key,
          value: sort?.value,
        })),
      });
    });
  }, []);

  return null;
}
