const fs = require("node:fs");
const path = require("node:path");

module.exports = {
  entry: {
    action: path.resolve(__dirname, "src/action.ts"),
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    {
      apply(compiler) {
        compiler.hooks.afterEmit.tap("CopyActionHtmlPlugin", () => {
          fs.mkdirSync(path.resolve(__dirname, "dist"), { recursive: true });
          fs.copyFileSync(
            path.resolve(__dirname, "src/action.html"),
            path.resolve(__dirname, "dist/action.html")
          );
        });
      },
    },
  ],
};
