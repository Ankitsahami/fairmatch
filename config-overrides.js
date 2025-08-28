const webpack = require("webpack");

module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    stream: require.resolve("stream-browserify"),
    buffer: require.resolve("buffer"),
    assert: require.resolve("assert"),
    crypto: require.resolve("crypto-browserify"),
    process: require.resolve("process/browser"),
    fs: false, // fs is not available in the browser
  };
  config.plugins = (
    config.plugins || []
  ).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);
  return config;
};

