const path = require('path');
const nodeExternals = require('webpack-node-externals');
const resolve = (dir) => path.resolve(__dirname, dir);

module.exports = {
  target: 'node',
  mode: 'development',
  entry: './server/index.js',
  output: {
    path: resolve('../build'),
    filename: 'bundle.js',
  },
  // 外部资源，不打包 node 环境的 node_modules
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-react', ['@babel/preset-env']],
        },
      },
      {
        test: /.css$/,
        use: [
          'isomorphic-style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
        ],
      },
    ],
  },
};
