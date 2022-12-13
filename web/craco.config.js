const webpack = require('webpack')

module.exports = {
  webpack: {
    configure: {
      plugins: [
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        }),
      ],
      resolve: {
        fallback: {
          buffer: require.resolve('buffer'),
          crypto: require.resolve('crypto-browserify'),
          path: require.resolve('path-browserify'),
          'process/browser': require.resolve('process/browser'),
          stream: require.resolve('stream-browserify'),
          zlib: require.resolve('browserify-zlib'),
        },
      },
    },
  },
}
