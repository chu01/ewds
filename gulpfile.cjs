// gulpfile.cjs
const { logIntroduction } = require("./task-logger/utils/log-helper.cjs");
logIntroduction("Building EWDS...");

const gulp = require("gulp");
const esbuild = require("esbuild");
const glob = require("glob");
const path = require("path");
const sass = require("sass");
const fs = require("fs");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const rename = require("gulp-rename");

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

// Error handling
function handleError(err) {
  console.error('Build error:', err.toString());
  process.exit(1);
}

// Clean dist
function clean(done) {
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true });
  }
  fs.mkdirSync('dist', { recursive: true });
  done();
}

// JS Build
function js() {
  const entryPoints = glob.sync("src/index.js");
  if (entryPoints.length === 0) {
    console.warn("No JS entry points found!");
    return Promise.resolve();
  }
  
  return esbuild.build({
    entryPoints,
    bundle: true,
    minify: true,
    sourcemap: true,
    format: "esm",
    outdir: paths.dist.js,
    entryNames: "[name].min",
    target: ["es2018"],
    external: [] // Specify external dependencies if any
  }).catch(handleError);
}

// CSS Build with PostCSS
function css() {
  return new Promise((resolve, reject) => {
    try {
      const outDir = paths.dist.css;
      fs.mkdirSync(outDir, { recursive: true });

      // Expanded CSS
      const result = sass.compile(path.resolve(paths.scssEntry), {
        style: "expanded",
        sourceMap: true
      });
      fs.writeFileSync(path.join(outDir, "ewds.css"), result.css);
      if (result.sourceMap) {
        fs.writeFileSync(path.join(outDir, "ewds.css.map"), JSON.stringify(result.sourceMap));
      }

      // Minified CSS
      const resultMin = sass.compile(path.resolve(paths.scssEntry), {
        style: "compressed"
      });
      fs.writeFileSync(path.join(outDir, "ewds.min.css"), resultMin.css);

      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

// Copy SCSS
function scss() {
  return gulp.src(paths.scss)
    .pipe(gulp.dest(paths.dist.scss))
    .on('error', handleError);
}

// Watch
function watch() {
  gulp.watch(paths.js, js).on('change', (path) => {
    console.log(`JS changed: ${path}`);
  });
  gulp.watch(paths.scss, gulp.series(css, scss)).on('change', (path) => {
    console.log(`SCSS changed: ${path}`);
  });
}

// Exports
exports.clean = clean;
exports.js = js;
exports.css = css;
exports.scss = scss;
exports.watch = watch;
exports.build = gulp.series(clean, gulp.parallel(js, css, scss));
exports.default = exports.build;