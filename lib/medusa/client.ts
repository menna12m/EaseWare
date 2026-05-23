import Medusa from "@medusajs/js-sdk"

/**
 * Shared Medusa SDK instance.
 *
 * The publishable key is required on every `/store/*` request. The SDK adds it
 * automatically via the `publishableKey` option.
 *
 * On the server, pair fetches with `next: { tags, revalidate }` via the helper
 * exports in `lib/api/medusa.ts` — the SDK's underlying `fetch` honours those.
 */
export const medusa = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  debug: process.env.NODE_ENV !== "production",
})

export const MEDUSA_URL =
  process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"

export const MEDUSA_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ""
