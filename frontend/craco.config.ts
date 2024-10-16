import { Configuration } from 'webpack';
import { CracoConfig } from '@craco/types';
import webpack from 'webpack';

const cracoConfig: CracoConfig = {
  webpack: {
    configure: (webpackConfig: Configuration): Configuration => {
      if (!webpackConfig.resolve) {
        webpackConfig.resolve = {};
      }
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        assert: require.resolve('assert'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify'),
        url: require.resolve('url'),
        buffer: require.resolve('buffer'),
      };
      
      if (!webpackConfig.plugins) {
        webpackConfig.plugins = [];
      }
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        })
      );

      return webpackConfig;
    },
  },
};

export default cracoConfig;