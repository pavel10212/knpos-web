/** @type {import('next').NextConfig} */
const nextConfig = {
  // Existing config options here...

  // Add this option to suppress hydration warnings
  reactStrictMode: true,
  onDemandEntries: {
    // Optional: configure page bundle size and lifetime
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  // Add images configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'knpos-bucket-senior-project-2.s3.us-east-1.amazonaws.com',
      },
    ],
  },

  // This tells Next.js to ignore certain attributes during hydration
  experimental: {
    // Other experimental features...

    // This suppresses the specific hydration warnings for Grammarly extension attributes
    // Note: This is experimental and may change in future Next.js versions
    suppressHydrationWarning: true,

    // Added from next.config.mjs
    turbo: false,
  },
}

module.exports = nextConfig
