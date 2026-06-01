/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    GOOGLE_SHEETS_ID: process.env.GOOGLE_SHEETS_ID,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  },
};
module.exports = nextConfig;
