module.exports = {
	//Compiled code
	entry: "./app/app.js",

	//Output to be used
	output: {
		filename: "public/bundle.js"
	},
	module: {
		loaders: [
		{
			test: /\.jsx?$/,
			exclude: /(node_modules|bower_components)/,
			loader: 'babel-loader',
			query: {
				presets: ['react', 'es2015']
			}
		}
	]
	}
}