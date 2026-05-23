import jwt from "jsonwebtoken"

/**
 * Mint a short-lived JWT that Medusa's custom wishlist routes will accept.
 *
 * Medusa's `requireCustomerId()` validates against `JWT_SECRET` (shared with the
 * backend) and pulls the customer id from `sub`. We use the Supabase user id as
 * the customer id — that's how reviews/wishlist are scoped to a person.
 *
 * Server-only. Never import this in a client component.
 */
export function mintMedusaCustomerJwt(supabaseUserId: string): string {
  const secret = process.env.MEDUSA_JWT_SECRET
  if (!secret) {
    throw new Error(
      "MEDUSA_JWT_SECRET is not set. Add it to .env.local — must match the JWT_SECRET in the Medusa backend's .env."
    )
  }

  return jwt.sign(
    {
      sub: supabaseUserId,
      actor_type: "customer",
      actor_id: supabaseUserId,
    },
    secret,
    { expiresIn: "1h" }
  )
}
