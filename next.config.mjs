/** @type {import('next').NextConfig} */
const R2_PUBLIC_URL = "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev";

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Massima sicurezza su Vercel/CI: gli eventuali warning o errori ESLint
    // non devono mai bloccare la build di produzione.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Il type-checking resta attivo: nessun errore TypeScript deve passare.
    ignoreBuildErrors: false,
  },
  images: {
    loader: "custom",
    loaderFile: "./src/lib/r2-image-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.cdninstagram.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.fbcdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scontent*.cdninstagram.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/images/:path*",
        destination: `${R2_PUBLIC_URL}/images/:path*`,
      },
      {
        source: "/videos/:path*",
        destination: `${R2_PUBLIC_URL}/videos/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/visite/ecografia",
        destination: "/visite/radiologia",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
