import type { NextConfig } from "next";
const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  /* config options here */
  eslint:{
    ignoreDuringBuilds:true,
  },
  output: 'export',
  basePath: isProd? '/playooxx':'',
  assetPrefix: isProd? '/playooxx':'',
  publicRuntimeConfig:{
    basePath:isProd? '/playooxx':''
  }

};

export default nextConfig;
