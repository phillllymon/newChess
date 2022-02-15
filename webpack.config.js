
const path = require("path");
module.exports = {
  entry: "/src/index.js",
  output: { path: path.resolve(__dirname, "dist") },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  watch: true,
  mode: "development"
};

// module.exports = {
//   entry: path.resolve(__dirname, './src/index.js'),
//   module: {
//     rules: [
//       {
//         test: /\.(js|jsx)$/,
//         exclude: /node_modules/,
//         use: ['babel-loader'],
//       },
//     ],
//   },
//   resolve: {
//     extensions: ['*', '.js', '.jsx'],
//   },
//   output: {
//     path: path.resolve(__dirname, './dist'),
//     filename: 'bundle.js',
//   },
//   devServer: {
//     contentBase: path.resolve(__dirname, './dist'),
//   },
// };