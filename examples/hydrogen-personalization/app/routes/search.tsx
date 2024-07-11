import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useState} from 'react';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {getPaginationVariables} from '@shopify/hydrogen';
import {useRootLoaderData} from '~/lib/root-data';
import type {
  StorefrontError,
  GetProductsByIdsQuery,
} from 'storefrontapi.generated';
import type {JsonifyObject} from '@shopify/hydrogen';

import {SearchForm, SearchResults, NoSearchResults} from '~/components/Search';

export const meta: MetaFunction = () => {
  return [{title: `Hydrogen | Search`}];
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const variables = getPaginationVariables(request, {pageBy: 8});
  const searchTerm = String(searchParams.get('q') || '');

  if (!searchTerm) {
    return {
      searchResults: {results: null, totalResults: 0},
      searchTerm,
    };
  }

  const {errors, ...data} = await context.storefront.query(SEARCH_QUERY, {
    variables: {
      query: searchTerm,
      ...variables,
    },
  });

  if (!data) {
    throw new Error('No search data returned from Shopify API');
  }

  const totalResults = Object.values(data).reduce((total, value) => {
    return total + value.nodes.length;
  }, 0);

  const searchResults = {
    results: data,
    totalResults,
  };

  return defer({
    searchTerm,
    searchResults,
  });
}

type PapiProduct =
  | JsonifyObject<{products: GetProductsByIdsQuery & StorefrontError}>
  | undefined;

function checkForDuplicateHandles(papiResults: [PapiProduct], searchResults) {
  const papiResultsHandles = papiResults?.map((product) => product.handle);
  const searchResultsHandles = searchResults?.map((product) => product.handle);
  return papiResultsHandles?.filter((handle: string) =>
    searchResultsHandles?.includes(handle),
  );
}

export default function SearchPage() {
  const {searchTerm, searchResults} = useLoaderData<typeof loader>();
  const [papiProducts, setPapiProducts] = useState<PapiProduct>([]);
  const rootData = useRootLoaderData();
  const personalize = rootData.personalize;

  const products = () => {
    const papi = async () => {
      const papiResult = await personalize;
      if (papiResult) return papiResult;
    };

    const fetchProducts = async () => {
      try {
        const result = await papi();
        setPapiProducts(result);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();

    const duplicateHandles = checkForDuplicateHandles(
      papiProducts?.products?.nodes,
      searchResults?.results?.products.nodes,
    );

    if (!duplicateHandles) return searchResults?.results?.products.nodes;

    searchResults?.results?.products.nodes?.forEach((product) => {
      product.papiRecommendation = duplicateHandles.includes(product.handle);
    });

    return searchResults?.results?.products.nodes;
  };

  return (
    <div className="search">
      <h1>Search</h1>
      <SearchForm searchTerm={searchTerm} />
      {!searchTerm || !searchResults.totalResults ? (
        <NoSearchResults />
      ) : (
        <SearchResults
          results={{
            products: {
              nodes: products(),
              pageInfo: searchResults?.results?.products.pageInfo,
            },
            pages: searchResults?.results?.pages,
            articles: searchResults?.results?.articles,
          }}
          searchTerm={searchTerm}
        />
      )}
    </div>
  );
}

const SEARCH_QUERY = `#graphql
  fragment SearchProduct on Product {
    __typename
    handle
    id
    publishedAt
    title
    trackingParameters
    vendor
    variants(first: 1) {
      nodes {
        id
        image {
          url
          altText
          width
          height
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
        product {
          handle
          title
        }
      }
    }
  }
  fragment SearchPage on Page {
     __typename
     handle
    id
    title
    trackingParameters
  }
  fragment SearchArticle on Article {
    __typename
    handle
    id
    title
    trackingParameters
  }
  query search(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $query: String!
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    products: search(
      query: $query,
      unavailableProducts: HIDE,
      types: [PRODUCT],
      first: $first,
      sortKey: RELEVANCE,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...on Product {
          ...SearchProduct
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
    pages: search(
      query: $query,
      types: [PAGE],
      first: 10
    ) {
      nodes {
        ...on Page {
          ...SearchPage
        }
      }
    }
    articles: search(
      query: $query,
      types: [ARTICLE],
      first: 10
    ) {
      nodes {
        ...on Article {
          ...SearchArticle
        }
      }
    }
  }
` as const;
