/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    BASE_URL: process.env.NODE_ENV === 'production'
      ? 'https://next-commerce-chi-five.vercel.app'
      : 'http://localhost:3000',
    CLOUDINARY_URL: "https://api.cloudinary.com/v1_1/dtram9qiy/image/upload",
    JWT_SECRET: "0db7ab9138ac1c6ad13f4069e41117c8",
  },
  images: {
    domains: ['res.cloudinary.com']
  },
  reactStrictMode: true,
}
