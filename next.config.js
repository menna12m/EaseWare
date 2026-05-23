const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: 'custom',
    loaderFile: './lib/utils/cloudinaryLoader.ts',
    remotePatterns: [
      // Cloudinary — primary CDN for product imagery and Strapi uploads in prod.
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      // Unsplash — used by the seed for placeholder product thumbnails.
      // Remove once you replace seeded images with real photos on Cloudinary.
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      // Strapi local upload provider — dev only.
      { protocol: 'http', hostname: 'localhost', port: '1337', pathname: '/uploads/**' },
      // Strapi on Railway preview URL.
      { protocol: 'https', hostname: '**.up.railway.app', pathname: '/uploads/**' },
      // Strapi on your custom subdomain.
      { protocol: 'https', hostname: 'cms.vanilla-wear.com', pathname: '/uploads/**' },
    ],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'swiper', 'lucide-react'],
  },
};

module.exports = withNextIntl(nextConfig);
