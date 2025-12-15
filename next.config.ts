const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@tensorflow/tfjs'] =
      require.resolve('@tensorflow/tfjs/dist/tf.min.js');
    return config;
  },
};

export default nextConfig;
