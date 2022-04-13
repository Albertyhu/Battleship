const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development', 
    entry: {
        index: {
            import: './src/index.js',
            dependOn: 'shared',
        },
        shared: 'lodash',
    },
    devServer: {
        static: './dist',
        historyApiFallback: true,
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },
    devtool: 'inline-source-map',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
        },
    }, 
    module: {
        rules: [
            // JavaScript      
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },

            {

                test: /\.(woff|woff2|eot|ttf|otf)$/i,

                type: 'asset/resource',

            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
            {
                test: /\.txt$/i,
                use: 'raw-loader',
            },
            {
                test: /\.mp3$/,
                loader: 'file-loader',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Custom Template',
            template: './src/home.html',
            minify: true,
        }),
    ],

};
