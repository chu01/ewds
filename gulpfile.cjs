// gulpfile.cjs

const { logIntroduction } = require("./task-logger/utils/log-helper.cjs");
logIntroduction("Building EWDS...");

const gulp = require("gulp");
const esbuild = require("esbuild");
const glob = require("glob");
const path = require("path");
const sass = require("sass");
const fs = require("fs");

const paths = {
  js: "src/**/*.js",
  scss: "src/styles/**/*.scss",
  scssEntry: "src/styles/ewds.scss",
  dist: {
    js: "dist/js",
    css: "dist/css",
    scss: "dist/scss"
  }
};

// -------------------------
// JS Build (esbuild)
// -------------------------
function js() {
  const entryPoints = glob.sync("src/index.js");
  return esbuild.build({
    entryPoints,
    bundle: true,
    minify: true,
    sourcemap: false,
    format: "esm",
    outdir: paths.dist.js,
    entryNames: "[name].min",
    target: ["es2018"],
    loader: {
      ".js": "js",
      ".scss": "text"
    }
  });
}

// -------------------------
// SCSS → CSS Build
// -------------------------
function css(done) {
  const outDir = paths.dist.css;
  fs.mkdirSync(outDir, { recursive: true });

  // normal CSS
  const result = sass.compile(path.resolve(paths.scssEntry), {
    style: "expanded"
  });
  fs.writeFileSync(path.join(outDir, "ewds.css"), result.css);

  // minified CSS
  const resultMin = sass.compile(path.resolve(paths.scssEntry), {
    style: "compressed"
  });
  fs.writeFileSync(path.join(outDir, "ewds.min.css"), resultMin.css);

  done();
}

// -------------------------
// Copy raw SCSS
// -------------------------
function scss() {
  return gulp.src(paths.scss).pipe(gulp.dest(paths.dist.scss));
}

// -------------------------
// Watch
// -------------------------
function watch() {
  gulp.watch(paths.js, js);
  gulp.watch(paths.scss, gulp.series(css, scss));
}

// -------------------------
exports.js = js;
exports.css = css;
exports.scss = scss;
exports.watch = watch;
exports.build = gulp.series(js, css, scss);
exports.default = exports.build;
