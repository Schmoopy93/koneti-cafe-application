
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
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          }
        ]
      }
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/index.html',
        destination: '/sr',
        permanent: true,
      }
    ];
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
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Turbopack konfiguracija
  turbopack: {
    resolveAlias: {
      '@': './src',
    },
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react', '@fortawesome/react-fontawesome']
  },
};

export default nextConfig;
