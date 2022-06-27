const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://next-commerce.vercel.app'
  : 'http://localhost:3000'

export default baseUrl