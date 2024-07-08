import {parseGid} from '@shopify/hydrogen';
import type {ProductRecommendation} from '~/lib/chord';

export const chordSort = (
  productNodes: any[],
  chordProducts: ProductRecommendation[],
) => {
  return productNodes.sort((a, b) => {
    const aId = parseGid(a.id).id;
    const bId = parseGid(b.id).id;
    const aIndex = chordProducts.findIndex(
      (product) => product.product_oms_id === aId,
    );
    const bIndex = chordProducts.findIndex(
      (product) => product.product_oms_id === bId,
    );
    return bIndex - aIndex;
  });
};

export const getCookie = (cookie: string, name: string): string | undefined => {
  return cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
};
