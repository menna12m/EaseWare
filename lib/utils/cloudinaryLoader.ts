// Custom next/image loader for Cloudinary.
// Cloudinary auto-negotiates WebP/AVIF when f_auto is set, and picks quality with q_auto.
// `src` can be either a full Cloudinary URL or just the public_id ("products/abc/front").

type LoaderArgs = { src: string; width: number; quality?: number };

export default function cloudinaryLoader({ src, width, quality }: LoaderArgs): string {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'easewear';
  const params = ['f_auto', `q_${quality || 'auto'}`, `w_${width}`, 'c_limit'];

  // If a full URL was passed (e.g. from CMS), splice the transformation segment in.
  if (src.startsWith('http')) {
    // Pattern: https://res.cloudinary.com/<cloud>/image/upload/<existing-or-empty>/<publicId>
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
