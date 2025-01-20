import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "u0hz7synnl-u0pntpwpub-ipfs.us0-aws.kaleido.io",
        pathname: "/ipfs/**",
        port: "",
      },
    ],
  },
};

export default nextConfig;
