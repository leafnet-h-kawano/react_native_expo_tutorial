/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // monorepo の packages をトランスパイル対象にする
  transpilePackages: ['@app/core'],
};

module.exports = nextConfig;
