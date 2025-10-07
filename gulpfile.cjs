// gulpfile.cjs
const gulp = require('gulp');
const esbuild = require('esbuild');
const glob = require('glob');
const path = require('path');

const paths = {
  js: 'src/**/*.js',
  dist: 'dist/js'
};

function js() {
  const entryPoints = glob.sync('src/index.js'); // adjust if needed
  return esbuild.build({
    entryPoints,
    bundle: true,
    minify: true,
    sourcemap: false,
    format: 'esm',
    outdir: paths.dist,
    entryNames: '[name].min',
    target: ['es2018'],
    loader: {
      '.js': 'js',
      '.scss': 'text',
    },
  });
}

function watch() {
  gulp.watch(paths.js, js);
}

exports.js = js;
exports.watch = watch;
exports.default = js;
