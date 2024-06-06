/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.igdb.com',
        port: '',
        pathname: '/igdb/image/upload/t_thumb/**',
      },
    ],
  },
  async redirects() {
    const now = new Date();
    return [
      {
        source: '/',
        destination: `/${now.getMonth()}/${now.getFullYear()}`,
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
