import type { NextConfig } from "next";
import createNextIntl from "next-intl/plugin";
import createMDX from '@next/mdx';

const withNextIntl = createNextIntl();
const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  redirects: async () => {
    return [
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "meet.carlosnexans.com",
          },
        ],
        destination: "https://calendly.com/nexanscarlos/30min",
        permanent: false,
      },
    ];
  },
};

// Compose both withMDX and withNextIntl
export default withMDX(withNextIntl(nextConfig));