// Custom next/image loader for Cloudinary.
// Cloudinary auto-negotiates WebP/AVIF when f_auto is set, and picks quality with q_auto.
// `src` can be either a full Cloudinary URL or just the public_id ("products/abc/front").
//
// When NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not configured (local dev without a real
// Cloudinary account), we fall back to the local /placeholder.svg so the layout still
// renders. Set the env var to start serving real Cloudinary assets.

type LoaderArgs = { src: string; width: number; quality?: number };

export default function cloudinaryLoader({ src, width, quality }: LoaderArgs): string {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  // Pass through anything that already points at an absolute non-Cloudinary URL
  // (e.g. CMS-hosted images, /placeholder.svg, /local-asset.png).
  if (src.startsWith('/') || src.startsWith('data:') || src.startsWith('blob:')) {
    return src;
  }
  if (src.startsWith('http') && !src.includes('res.cloudinary.com')) {
    return src;
  }

  // No cloud configured → show the local placeholder so dev doesn't render broken icons.
  if (!cloud) {
    return '/placeholder.svg';
  }

  const params = ['f_auto', `q_${quality || 'auto'}`, `w_${width}`, 'c_limit'];

  // If a full Cloudinary URL was passed (e.g. from CMS), splice the transformation segment in.
  if (src.startsWith('http')) {
    const marker = '/image/upload/';
    const idx = src.indexOf(marker);
    if (idx === -1) return src;
    const head = src.slice(0, idx + marker.length);
    const tail = src.slice(idx + marker.length).replace(/^v\d+\//, ''); // drop version
    return `${head}${params.join(',')}/${tail}`;
  }

  // Bare public_id case
  const id = src.replace(/^\//, '');
  return `https://res.cloudinary.com/${cloud}/image/upload/${params.join(',')}/${id}`;
}
