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
};

export default nextConfig;
