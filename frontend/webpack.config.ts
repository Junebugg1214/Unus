import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import webpack, { Configuration } from 'webpack';

const config: Configuration = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 9000,
  },
};

export default config;

