/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap.xml',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blow.igoshev.de',
        port: '',
        pathname: '**',
      },
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'blow.igoshev.de',
        port: '',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
