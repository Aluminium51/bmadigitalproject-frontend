import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.56.1', '172.29.240.1', '192.168.1.77', 'localhost'],
};

module.exports = {
  allowedDevOrigins: ['192.168.56.1', '172.29.240.1', '192.168.1.77', 'localhost'],
}

export default nextConfig;
