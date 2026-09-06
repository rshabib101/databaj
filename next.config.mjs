/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/dashboard/:tab(overview|audits|orders|credentials|support|tasks|ai-copy|profile)',
        destination: '/dashboard?tab=:tab',
      },
      {
        source: '/admin/:tab(overview|campaigns|clients|consultations|services|founder|settings|tickets|credentials|tasks|client-ad)',
        destination: '/admin?tab=:tab',
      },
    ];
  },
};

export default nextConfig;
