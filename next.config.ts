import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Placeholder images for local/sample development content only.
      // Swap/extend this once Cloudflare R2 (NEXT_PUBLIC_R2_PUBLIC_URL) is wired up.
      { protocol: "https", hostname: "picsum.photos" },
      
      // YouTube thumbnails
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
};

export default nextConfig;
