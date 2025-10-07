/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false, // Set false jika menggunakan pages directory
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  images: {
    domains: ['drive.google.com'],
  },
}

module.exports = nextConfig