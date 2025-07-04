/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['a.storyblok.com'], // ✅ allow Storyblok images
  },
};

export default nextConfig;
