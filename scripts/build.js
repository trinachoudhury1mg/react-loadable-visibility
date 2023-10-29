const webpack = require('webpack');
const webpackConfig = require("../config/webpack.config")

function build() {
    const compiler = webpack(webpackConfig);

    compiler.run((err, stats) => {
        console.log("status", stats)
    })
}

build()

console.log("Running build....", process.argv)