/** @type {import('next').NextConfig} */
module.exports = {
  async redirects() {
    return [{ source: '/old', destination: '/new', statusCode: 301 }]
  },
}
