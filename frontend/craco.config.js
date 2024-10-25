const { ProvidePlugin } = require('webpack');
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const modifiedConfig = {
        ...webpackConfig,
        resolve: {
          ...webpackConfig.resolve,
          fallback: {
            crypto: require.resolve('crypto-browserify'),
            stream: require.resolve('stream-browserify'),
            assert: require.resolve('assert'),
            http: require.resolve('stream-http'),
            https: require.resolve('https-browserify'),
            os: require.resolve('os-browserify'),
            url: require.resolve('url'),
            buffer: require.resolve('buffer'),
          },
          alias: {
            ...webpackConfig.resolve?.alias,
            '@': path.resolve(__dirname, 'src'),
          },
        },
        plugins: [
          ...(webpackConfig.plugins || []),
          new ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
          }),
          new ESLintPlugin({
            extensions: ['js', 'jsx', 'ts', 'tsx'],
            failOnError: false,
            emitWarning: true,
            quiet: true,
          }),
        ],
      };

      return modifiedConfig;
    },
  },
  style: {
    postcss: {
      loaderOptions: {
        postcssOptions: {
          plugins: [
            require('postcss-import'),
            require('tailwindcss'),
            require('autoprefixer'),
          ],
        },
      },
    },
  },
  babel: {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
      '@babel/preset-typescript',
    ],
    plugins: [
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-proposal-private-methods', { loose: true }],
      ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
      '@babel/plugin-transform-runtime',
    ],
  },
  eslint: {
    enable: false, // Disable CRACO's ESLint since we're using eslint-webpack-plugin
  },
};