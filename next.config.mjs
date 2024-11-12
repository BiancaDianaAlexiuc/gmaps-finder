/** @type {import('next').NextConfig} */
const nextConfig = {
  //   eslint: {
  //     // Warning: This allows production builds to successfully complete even if
  //     // your project has ESLint errors.
  //     ignoreDuringBuilds: true,
  //   },
  images: {
    domains: [
      "platform-lookaside.fbsbx.com", //facebook,
      "lh3.googleusercontent.com", //google
    ],
  },
};

export default nextConfig;
