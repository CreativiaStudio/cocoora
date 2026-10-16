/**
 * Vercel static-export adapter for Cocoora.
 *
 * Runs on Vercel during the build. It writes a temporary static-export config
 * over `next.config.mjs`, runs `next build` with `output: "export"`, then
 * restores the original config.
 *
 * The repository is never modified permanently and none of this runs locally:
 * the default `npm run build` keeps producing the standard Next.js server
 * build. This adapter exists only so a login-less Vercel deployment (which is
 * capped at 20 serverless functions) can serve the whole site as static files.
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const CONFIG = "next.config.mjs";
const original = readFileSync(CONFIG, "utf8");

const staticConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
`;

try {
  writeFileSync(CONFIG, staticConfig, "utf8");
  execSync("npx next build", { stdio: "inherit", shell: true });
} finally {
  writeFileSync(CONFIG, original, "utf8");
}
