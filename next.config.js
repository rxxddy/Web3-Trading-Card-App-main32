/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Игнорируем стандартные модули Node.js
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        perf_hooks: false,
        os: false,
        path: false,
        http: false,
        https: false,
        stream: false,
        crypto: false,
      };

      config.module.rules.push({
        test: /node:/,
        use: 'null-loader',
      });
    }
    return config;
  },
};

module.exports = nextConfig;