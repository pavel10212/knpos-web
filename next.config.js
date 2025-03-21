/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'knpos-bucket-senior-project-2.s3.us-east-1.amazonaws.com',
      },
    ],
  }
  // Remove experimental section entirely
}

module.exports = nextConfig