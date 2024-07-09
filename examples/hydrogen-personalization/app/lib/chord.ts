import mockResponse from '../mocks/personalization.json';

export interface ProductRecommendation {
  index: number;
  product_oms_id: string;
  product_name: string;
}

export interface PersonalizationResponse {
  user_id?: string;
  rfm_score_bucket?: number;
  product_recommendations?: ProductRecommendation[];
  last_page_utm_source?: string;
  last_page_utm_medium?: string;
  last_page_utm_campaign?: string;
}

export interface RecommendedProductFields {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    nodes: {
      id: string;
      url: string;
      altText: string | null;
      width: number | null;
      height: number | null;
    }[];
  };
}

export interface GetPersonalizationOptions {
  anonymousId?: string | null;
  userId?: string | null;
}

const mockPersonalizationResponse: PersonalizationResponse = mockResponse;

/**
 * Create an API client for the Chord Personalization API.
 */
export function createPersonalizationClient(options: {
  userId?: string;
  password?: string;
  useMock?: boolean;
}) {
  const {useMock} = options;
  const authorization = `Basic ${`${options.userId}:${options.password}`}`;

  return {
    getPersonalization: async (
      options: GetPersonalizationOptions,
    ): Promise<PersonalizationResponse> => {
      if (useMock) return Promise.resolve(mockPersonalizationResponse);

      const {anonymousId, userId} = options;
      const base = 'https://stable.personalization.chord.co/api/v1';
      const path = userId ? `users/${userId}` : `anonymous/${anonymousId}`;

      try {
        const response = await fetch(`${base}/${path}`, {
          headers: {
            Authorization: authorization,
          },
        });

        if (!response.ok) {
          throw new Error();
        }

        return response.json() as PersonalizationResponse;
      } catch (error) {
        console.log('Failed to fetch Chord personalization data', error);
        return {};
      }
    },
  };
}
