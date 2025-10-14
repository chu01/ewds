const sass = require("sass");
const fs = require("fs");
const path = require("path");

function compileSass() {
  return new Promise((resolve, reject) => {
    try {
      const scssEntry = "src/styles/ewds.scss";
      const outDir = "dist/css";
      
      fs.mkdirSync(outDir, { recursive: true });

      // Expanded
      const result = sass.compile(path.resolve(scssEntry), {
        style: "expanded",
        loadPaths: [path.dirname(scssEntry)]
      });
      fs.writeFileSync(path.join(outDir, "ewds.css"), result.css);

      // Minified
      const resultMin = sass.compile(path.resolve(scssEntry), {
        style: "compressed",
        loadPaths: [path.dirname(scssEntry)]
      });
      fs.writeFileSync(path.join(outDir, "ewds.min.css"), resultMin.css);

      console.log("✅ Sass compilation completed");
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

exports.compileSass = compileSass;