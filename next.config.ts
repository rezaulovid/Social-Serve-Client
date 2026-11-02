import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/7.x/avataaars/svg/**",
      },
      {
        protocol: "https",
        hostname: "www.magnific.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
  protocol: "https",
  hostname: "images.unsplash.com",
},
    ],
  },
  cacheComponents: false,
  partialPrefetching: false,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
