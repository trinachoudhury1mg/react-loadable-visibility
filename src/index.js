const { cosmiconfigSync } = require("react-loadable-visibility");

const explorerSync = cosmiconfigSync("loadableConfig.json");

const searchedFor = explorerSync.search();
// const loaded = explorerSync.load(pathToConfig);

console.log(searchedFor);
module.exports = require("./loadable-components");
