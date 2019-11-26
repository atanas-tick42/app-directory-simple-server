const path = require('path');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin')

const webpackConfig = {
  entry: {
    main: './app/index.ts',
    'role-editor-ui': './role-editor-ui/index.ts'
  },
  mode: 'production',
  target: 'node',
  node: {
    __filename: true,
    __dirname: true
  },
  context: __dirname,
  devtool: 'source-map',
  externals: [nodeExternals({
    whitelist: []
  })],
  watch: false,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              allowTsInNodeModules: true
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.node$/,
        include: /node_modules/,
        use: [
          {
            loader: 'awesome-node-loader',
            options: {
              name: '[hash].[ext]',
              rewritePath: '.',
              useDirname: false,
            },
          },
        ],
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CopyPlugin([
      {from:'node_modules/sqlite3/lib/binding/node-v72-win32-x64/node_sqlite3.node', to: '.'},
      {from:'node_modules/node-sspi/bin/win32-x64-node-12/nodeSSPI.node', to: '.'}
    ])
  ]
};

const isDev = process.argv.includes('--dev');

if (isDev) {
  webpackConfig.watch = true;
  webpackConfig.mode = 'development';
  webpackConfig.output.path = webpackConfig.output.path.replace('dist', 'dist-dev')
  // webpackConfig.plugins.push(new NodemonPlugin({
  //   args: ['--dev'],
  //   watch: path.resolve('./dist-dev'),
  //   verbose: true,
  //   script: './dist-dev/index.js',
  // }))
  // webpackConfig.output.path.replace('dist')
}

console.log(webpackConfig);

module.exports = webpackConfig;