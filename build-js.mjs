// build-js.mjs
import { glob } from "glob";
import { build } from "esbuild";
import fs from "fs";
import path from "path";
import url from "url";
import { sassPlugin } from "esbuild-sass-plugin";


const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

async function bundleAll() {
  console.log("📦 Bundling JS files...");

  // 1️⃣ Find all JS files under src/packages/components/
  const files = await glob("src/packages/components/**/*.js", { absolute: true });
  console.log(`Found ${files.length} component files`);

  // 2️⃣ Create a temporary entry file that imports them all
  const tempDir = path.join(__dirname, "dist/temp");
  const entryFile = path.join(tempDir, "entry.js");

  fs.mkdirSync(tempDir, { recursive: true });

  // 🧹 Filter out test and storybook files
  const imports = files
    .filter(f =>
      !f.includes(".spec.") &&
      !f.includes(".test.") &&
      !f.includes("/test/") &&
      !f.endsWith(".stories.js")
    )
    .map(f => `import "${path.relative(tempDir, f).replace(/\\/g, "/")}";`)
    .join("\n");

  fs.writeFileSync(entryFile, imports);

  // 3️⃣ Run esbuild to bundle everything into one minified file
  try {
    await build({
      entryPoints: [entryFile],
      bundle: true,
      minify: true,
      outfile: "dist/js/ewds.min.js",
      format: "esm",
      target: ["es2018"],
      logLevel: "info",
      plugins: [sassPlugin()],
      absWorkingDir: path.join(__dirname, "src/packages"),

      // ✅ Loaders for assets
      loader: {
        ".js": "js",
        ".css": "css",
        ".svg": "dataurl",
        ".png": "dataurl",
        ".jpg": "dataurl",
        ".jpeg": "dataurl",
        ".woff": "file",
        ".woff2": "file",
      },
      assetNames: "assets/[name]-[hash]",
    });

    console.log("✅ JS bundling completed successfully!");
  } catch (err) {
    console.error("❌ Build failed:", err.message);
    process.exit(1);
  }

  // 4️⃣ Clean up temp directory
  fs.rmSync(tempDir, { recursive: true, force: true });
}

bundleAll();