const path = require("path");
// const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'production',
    target: 'node',
    entry: './index.ts',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'build'),
        publicPath: 'public'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader'
                }
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.ts'],
    },
    // plugins: [
    //     new CopyPlugin({
    //         patterns: [
    //             { from: "prisma", to: "prisma" },
    //             { from: "public", to: "public" },
    //         ],
    //     }),
    // ],
}