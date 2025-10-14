// gulpfile.cjs - IMPROVED VERSION
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
  scss: "src/**/*.scss",  // All SCSS files
  scssEntry: "src/styles/ewds.scss",
  dist: {
    base: "dist",
    js: "dist/js", 
    css: "dist/css",
    scss: "dist/scss/src"  // Maintain source structure
  }
};

// Error handling
function handleError(err) {
  console.error('Build error:', err.toString());
  process.exit(1);
}

// Clean distribution
function clean(done) {
  if (fs.existsSync(paths.dist.base)) {
    fs.rmSync(paths.dist.base, { recursive: true });
  }
  fs.mkdirSync(paths.dist.base, { recursive: true });
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
    target: ["es2018"]
  }).catch(handleError);
}

// CSS Build
function css() {
  return new Promise((resolve, reject) => {
    try {
      const outDir = paths.dist.css;
      fs.mkdirSync(outDir, { recursive: true });

      // Expanded CSS
      const result = sass.compile(path.resolve(paths.scssEntry), {
        style: "expanded",
        loadPaths: [path.dirname(paths.scssEntry)]  // Fix import paths
      });
      fs.writeFileSync(path.join(outDir, "ewds.css"), result.css);

      // Minified CSS
      const resultMin = sass.compile(path.resolve(paths.scssEntry), {
        style: "compressed",
        loadPaths: [path.dirname(paths.scssEntry)]
      });
      fs.writeFileSync(path.join(outDir, "ewds.min.css"), resultMin.css);

      console.log(`✅ CSS built: ${path.join(outDir, "ewds.css")}`);
      resolve();
    } catch (err) {
      console.error('❌ CSS build failed:', err.message);
      reject(err);
    }
  });
}

// Copy SCSS sources
function scss() {
  return gulp.src(paths.scss)
    .pipe(gulp.dest(paths.dist.scss))
    .on('error', handleError);
}

// Watch files
function watch() {
  gulp.watch(paths.js, js).on('change', (path) => {
    console.log(`🔁 JS changed: ${path}`);
  });
  gulp.watch(paths.scss, gulp.series(css, scss)).on('change', (path) => {
    console.log(`🔁 SCSS changed: ${path}`);
  });
}

// Export tasks
exports.clean = clean;
exports.js = js;
exports.css = css;
exports.scss = scss;
exports.watch = watch;
exports.build = gulp.series(clean, gulp.parallel(js, css, scss));
exports.default = exports.build;