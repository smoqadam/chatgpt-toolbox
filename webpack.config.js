const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    watch: true,
    entry: {
        serviceWorker: './src/scripts/serviceWorker.js',
        contentScript: './src/scripts/contentScript.js',
        popup: './src/scripts/popup.js',
        options: './src/scripts/options.js'
    },
    output: {
        filename: 'src/js/[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/options.html',
            inject: 'body',
            minify: false,
            chunks: ['options'],
            filename: 'src/options.html',
        }),
        new HtmlWebpackPlugin({
            template: 'src/popup.html',
            inject: 'body',
            minify: false,
            chunks: ['popup'],
            filename: 'src/popup.html',
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: 'src/assets', to: 'src/assets' }],
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: 'src/css/popup.css', to: 'src/css/popup.css' }],
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: 'manifest.json', to: 'manifest.json' }],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.html$/i,
                // exclude: /node_modules/,
                loader: "html-loader",
            },
            {
                test: /.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: [
                      ['@babel/preset-env', { targets: "defaults" }]
                    ]
                  }
                }
              },
              {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
              },
        ],
    }
};
