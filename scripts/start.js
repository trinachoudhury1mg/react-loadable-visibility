
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require("../config/webpack.config");

console.log("Running start....", process.argv)

function start() {
    const compiler = webpack(webpackConfig);
    const devServer = new WebpackDevServer(webpackConfig, compiler);

    devServer.startCallback(() => {
        console.log("Dev server config working....")
    })
}

start()