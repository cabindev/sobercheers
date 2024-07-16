/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'healthy-sobriety.sdnthailand.com/auth/signin',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'healthy-sobriety.sdnthailand.com/auth/signin',
        port: '',
        pathname: '/img/**',
      },
    ],
  },
};

export default nextConfig;
