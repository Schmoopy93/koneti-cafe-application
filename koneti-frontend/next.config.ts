import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bezbednosni header-i
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },

  // Content Security Policy
  async rewrites() {
    return [];
  },

  // Optimizacije za produkciju
  compress: true,
  poweredByHeader: false,
  
  // Image optimizacija
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      }
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Turbopack konfiguracija (Next.js 16+)
  turbopack: {
    root: 'C:/Users/mrajic/Desktop/koneti-cafe-application/koneti-frontend'
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react', '@fortawesome/react-fontawesome']
  }
};

export default nextConfig;