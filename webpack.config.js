const webpack = require('webpack');
const { resolve } = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;
const CopyWebpackPlugin = require("copy-webpack-plugin");

const paths = {
    dist: resolve(__dirname, 'dist'),
    src: resolve(__dirname, 'src'),
    app: resolve(__dirname, 'src/app'),
};

const plugins = [];

let devtool = 'inline-source-map';

if (process.env.NODE_ENV === 'production') {
    devtool = 'source-map';
    plugins.push(
        new StatsWriterPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            mangle: { screw_ie8: true },
            compress: { screw_ie8: true, warnings: false },
            sourceMap: true
        })
    );
}

module.exports = {
    entry: resolve(paths.app, 'index.tsx'),
    devtool,
    output: {
        filename: 'bundle.js',
        path: paths.dist,
        publicPath: '/',
        libraryTarget: 'umd',
    },
    resolve: {
        extensions: ['.js', '.json', '.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: [paths.app],
                use: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            configFileName: resolve(paths.app, 'tsconfig.json'),
                        },
                    },
                ],
            },
            {
                test: /\.scss$/,
                include: [paths.app],
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader'],
                })
            },
            {
                test: /\.svg$/,
                include: [paths.app],
                use: ['preact-svg-loader'],
            }
        ],
    },
    plugins: [
        new ExtractTextPlugin("styles.css"),
        new CopyWebpackPlugin([
            {
                from: 'src/index.tmpl.html',
                to: 'index.tmpl.html',
            },
        ]),

        ...plugins,
    ],
}
