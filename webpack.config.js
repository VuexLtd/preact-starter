const webpack = require('webpack');
const { resolve } = require('path');

const paths = {
    dist: resolve(__dirname, 'dist'),
    src: resolve(__dirname, 'src'),
};

module.exports = {
    entry: './src/index.tsx',
    devtool: 'inline-source-map',
    output: {
        filename: 'bundle.js',
        path: paths.dist,
        publicPath: '/',
    },
    devServer: {
        hot: true,
        contentBase: paths.src,
        publicPath: '/',
    },
    resolve: {
        extensions: [".js", ".json", ".ts", ".tsx"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: [paths.src],
                use: ['awesome-typescript-loader'],
            },
            {
                test: /\.scss$/,
                include: [paths.src],
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.svg$/,
                include: [paths.src],
                use: ['preact-svg-loader'],
            }
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
    ],
}
