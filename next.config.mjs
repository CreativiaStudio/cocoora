/** @type {import('next').NextConfig} */
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
};

export default nextConfig;
