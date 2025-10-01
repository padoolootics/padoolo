import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wp1.manageprojects.co.uk',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'padoolo-nine.vercel.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'padoolo.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.padoolo.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
