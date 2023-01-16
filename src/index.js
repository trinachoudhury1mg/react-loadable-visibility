const { cosmiconfigSync } = require("cosmiconfig");

const explorerSync = cosmiconfigSync("react-loadable-visibility");

const searchedFor = explorerSync.search();
// const loaded = explorerSync.load(pathToConfig);

console.log(searchedFor);
module.exports = require("./loadable-components");
