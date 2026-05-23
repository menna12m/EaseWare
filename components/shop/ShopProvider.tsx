'use client';

import { ReactNode, useMemo } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Configure } from 'react-instantsearch';

// Empty-results stub. Used when Algolia env vars are missing — keeps the shop
// UI rendering instead of throwing "Unreachable hosts". Drop in real keys to
// switch over without code changes.
const stubClient = {
  search<T = unknown>(requests: { indexName: string }[]) {
    return Promise.resolve({
      results: requests.map(() => ({
        hits: [] as T[],
        nbHits: 0,
        nbPages: 0,
        page: 0,
        processingTimeMS: 0,
        hitsPerPage: 0,
        exhaustiveNbHits: true,
        query: '',
        params: '',
      })),
    });
  },
  searchForFacetValues() {
    return Promise.resolve([]);
  },
} as unknown as ReturnType<typeof algoliasearch>;

function makeClient() {
  const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
  const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY;
  if (!appId || !searchKey) {
    if (typeof window !== 'undefined') {
      console.warn(
        '[shop] Algolia env vars not set — using empty-results stub. Configure NEXT_PUBLIC_ALGOLIA_APP_ID + NEXT_PUBLIC_ALGOLIA_SEARCH_KEY to enable search.'
      );
    }
    return stubClient;
  }
  return algoliasearch(appId, searchKey);
}

export const ALGOLIA_INDEX = 'easewear_products';

type Props = {
  children: ReactNode;
  // Note: react-instantsearch v7 picks up the URL via routing on the client.
  // Initial UI state (e.g. from a server-side router param) can be passed in
  // through `initialUiState` to keep the first paint consistent with the URL.
  initialUiState?: Record<string, unknown>;
};

export function ShopProvider({ children, initialUiState }: Props) {
  const client = useMemo(() => makeClient(), []);

  return (
    <InstantSearch
      searchClient={client}
      indexName={ALGOLIA_INDEX}
      future={{ preserveSharedStateOnUnmount: true }}
      // initialUiState seeds Algolia's refinements from server-parsed search params
      // so the very first paint (SSR or hydrated) reflects the URL. After that, the
      // routing middleware (enabled below) takes over and keeps URL <-> state in sync.
      initialUiState={initialUiState as any}
      routing
    >
      <Configure hitsPerPage={24} />
      {children}
    </InstantSearch>
  );
}
