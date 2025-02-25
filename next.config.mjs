/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turboMode: false,
  },
  images: {
    domains: [
      'knpos-bucket-senior-project-2.s3.us-east-1.amazonaws.com',
    ],
  },
};

export default nextConfig;
