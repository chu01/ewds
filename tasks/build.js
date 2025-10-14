const { series, parallel } = require("gulp");
const { cleanDist } = require("./clean");
const { compileSass } = require("./sass");
const { compileJS } = require("./javascript");
const { copySCSS } = require("./copy");

function build() {
  return series(
    cleanDist,
    parallel(compileJS, compileSass, copySCSS)
  );
}

exports.build = build;