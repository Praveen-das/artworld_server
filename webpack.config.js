const path = require("path");

module.exports = {
  mode: "production",
  target: "node",
  entry: "./index.ts",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index.js",
    publicPath: "public",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts"],
    alias: {
      pkginfo: path.resolve(__dirname, "mocks/pkginfo.js"),
    },
  },
};
