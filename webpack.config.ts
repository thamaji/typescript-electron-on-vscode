import CopyPlugin from 'copy-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';

const main = (env: unknown, options: { mode: string }): webpack.Configuration => {
  return {
    target: 'electron-main',
    devtool: options.mode == 'development' ? 'inline-source-map' : undefined,
    entry: path.join(__dirname, 'src', 'main', 'main'),
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist')
    },
    node: {
      __dirname: false,
      __filename: false
    },
    resolve: {
      extensions: ['.js', '.ts']
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new ESLintPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: path.join(__dirname, 'src', 'package.json'),
            to: path.join(__dirname, 'dist', 'package.json')
          }
        ],
      })
    ]
  }
};

const renderer = (env: unknown, options: { mode: string }): webpack.Configuration => {
  return {
    target: 'electron-renderer',
    devtool: options.mode == 'development' ? 'inline-source-map' : undefined,
    entry: path.join(__dirname, 'src', 'renderer', 'main'),
    output: {
      filename: 'renderer.js',
      path: path.resolve(__dirname, 'dist')
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.wasm']
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader'
            }
          ]
        }
      ]
    },
    plugins: [
      new ESLintPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'src', 'renderer', 'index.html'),
        title: process.env['npm_package_name']
      })
    ]
  }
};

export default [main, renderer];
