'use client';

import { ReactNode, useMemo } from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Configure } from 'react-instantsearch';
import { medusaSearchClient } from '@/lib/shop/medusa-search-client';

// Falls back to a Medusa-backed adapter when Algolia env vars are absent —
// see lib/shop/medusa-search-client.ts. Drop the Algolia keys into .env.local
// to switch over without code changes.
function makeClient() {
  const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
  const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY;
  if (!appId || !searchKey) {
    return medusaSearchClient as unknown as ReturnType<typeof algoliasearch>;
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
