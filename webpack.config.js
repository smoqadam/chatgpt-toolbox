const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        serviceWorker: './src/scripts/serviceWorker.js',
        contentScript: './src/scripts/contentScript.js',
        popup: './src/scripts/popup.js'
    },
    output: {
        filename: 'src/scripts/[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/options.html',
            inject: 'body',
            hash: true,
            minify: false,
            chunks: ['options'],
            filename: 'src/options.html',
        }),
        new HtmlWebpackPlugin({
            template: 'src/popup.html',
            inject: 'body',
            minify: false,
            hash: true,
            chunks: ['popup'],
            filename: 'src/popup.html',
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: 'src/assets', to: 'src/assets' }],
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: 'manifest.json', to: 'manifest.json' }],
        }),
    ]
};
