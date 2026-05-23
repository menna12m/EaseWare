import { NextResponse, type NextRequest } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

// Strapi (or Medusa) calls this webhook on content publish/update.
// Body shape we accept:
//   { secret, tags?: string[], paths?: string[] }
// Tags map to the `next: { tags }` keys used by lib/api/strapi.ts and medusa.ts.
//
// Auth: pass ?secret=<token> or { secret } in the body — must match REVALIDATE_SECRET.
export async function POST(request: NextRequest) {
  const secretFromQuery = request.nextUrl.searchParams.get('secret');
  const expected = process.env.REVALIDATE_SECRET;

  let body: { secret?: string; tags?: string[]; paths?: string[] } = {};
  try {
    body = await request.json();
  } catch {
    // Allow empty bodies — webhook may use query string only
  }

  if (expected && body.secret !== expected && secretFromQuery !== expected) {
    return NextResponse.json({ ok: false, error: 'invalid secret' }, { status: 401 });
  }

  const tags = body.tags ?? [];
  const paths = body.paths ?? [];

  for (const tag of tags) revalidateTag(tag);
  for (const path of paths) revalidatePath(path);

  return NextResponse.json({ ok: true, revalidated: { tags, paths }, ts: Date.now() });
}

// Optional GET handler so you can sanity-check the endpoint from a browser.
export async function GET() {
  return NextResponse.json({ ok: true, method: 'POST to revalidate' });
}
