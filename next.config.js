/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Hide "X-Powered-By: Next.js"

  async redirects() {
    return [
      { source: '/privacy', destination: '/legal/privacy', permanent: true },
      { source: '/terms', destination: '/legal/terms', permanent: true },
      { source: '/refund', destination: '/legal/refund', permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking
          { key: 'X-Frame-Options', value: 'DENY' },
          // Prevent MIME sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // XSS protection
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // Referrer policy
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // HSTS — force HTTPS for 1 year
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          // Permissions — disable dangerous APIs
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          // Content Security Policy — strict
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://apis.google.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.razorpay.com https://lumberjack.razorpay.com https://accounts.google.com https://www.googleapis.com",
              "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://accounts.google.com https://www.google.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://accounts.google.com https://api.razorpay.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },
          // Prevent DNS prefetch leaks
          { key: 'X-DNS-Prefetch-Control', value: 'off' },
          // Download options — noopen
          { key: 'X-Download-Options', value: 'noopen' },
          // Permitted cross-domain policies
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
        ],
      },
      // Extra strict on API routes
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Access-Control-Allow-Origin', value: 'https://paperpe.in' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
