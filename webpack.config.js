var HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
	entry: './src/index.ts',
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'docs'),
	},
	// plugins: [
	// 	new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
	// 	new HtmlWebpackPlugin({
	// 		title: 'Development',
	// 	})
	// ],
	  devServer: {
		contentBase: './src',
		watchContentBase: true,
	    compress: true,
	    port: 9000
	  },
};