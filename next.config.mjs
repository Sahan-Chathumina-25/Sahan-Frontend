/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for GitHub Pages (user site serves from domain root, no basePath needed).
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // next/image optimization requires a server — disable for static export.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
  // NOTE: `headers()` is ignored by `output: 'export'` (no server to attach
  // response headers). Security headers must be handled at the CDN/reverse-proxy
  // layer if needed — GitHub Pages does not support custom response headers,
  // so the previous async headers() block was removed intentionally.
};

export default nextConfig;
