const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
	entry: __dirname + "/main.ts",
	output: {
		path: __dirname + "/dist",
		filename: "bundle.js",
		publicPath: "/",
	},
	resolve: {
		extensions: [".mjs", ".js", ".jsx", ".json", ".ts", ".tsx"],
	},
	module: {
		rules: [
			{
				test: /\.ts(x)?/,
				loader: "ts-loader",
			},
			{
				test: /\.(sass|scss)$/,
				use: [
					{
						loader: "style-loader", // creates style nodes from JS strings
					},
					{
						loader: "css-loader", // translates CSS into CommonJS
					},
					{
						loader: "sass-loader", // compiles Sass to CSS
					},
				],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: __dirname + "/index.html",
			inject: "body",
		}),
	],
	devServer: {
		contentBase: "./src/public",
		port: 7700,
	},
};
