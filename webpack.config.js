const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');



module.exports = {
  entry: './server.js',
  resolve: {
    modules: [
      'node_modules'
    ],
    extensions: ['.js', '.jsx'],
    fallback: {
   
      async_hooks: false,
    }
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
        // Use esbuild to compile JavaScript & TypeScript
        {
        // Match `.js`, `.jsx`, `.ts` or `.tsx` files
        test: /\.[jt]sx?$/,
        loader: 'esbuild-loader',
        options: {
            // JavaScript version to compile to
            target: 'es2015'
          }
        },
      ],
    },
    plugins: [
      new NodePolyfillPlugin(),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 3000,
    },
  };