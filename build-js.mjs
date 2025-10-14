// build-js.mjs
import { glob } from "glob";
import { build } from "esbuild";
import fs from "fs";
import path from "path";
import { sassPlugin } from "esbuild-sass-plugin";

async function bundleAll() {
  console.log("📦 Bundling EWDS components...");

  const componentFiles = await glob("src/packages/components/**/*.js", {
    absolute: true,
    ignore: [
      "**/*.spec.js",
      "**/*.test.js",
      "**/test/**",
      "**/*.stories.js",
      "**/__tests__/**",
      "**/__mocks__/**"
    ]
  });

  console.log(`Found ${componentFiles.length} component files:`);
  componentFiles.forEach((file, index) => {
    console.log(`  ${index + 1}. ${path.relative(process.cwd(), file)}`);
  });

  if (componentFiles.length === 0) {
    console.warn("⚠️  No component files found!");
    return;
  }

  const tempDir = path.join(process.cwd(), "dist/temp");
  const entryFile = path.join(tempDir, "entry.js");

  // Ensure clean temp directory
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true });
  }
  fs.mkdirSync(tempDir, { recursive: true });

  // Create entry file
  const imports = componentFiles
    .map(file => `import "${file}";`)
    .join("\n");
  
  fs.writeFileSync(entryFile, imports);

  try {
    await build({
      entryPoints: [entryFile],
      bundle: true,
      minify: true,
      sourcemap: true,
      outfile: "dist/js/ewds.min.js",
      format: "esm",
      target: ["es2018"],
      logLevel: "info",
      plugins: [sassPlugin()],
      absWorkingDir: process.cwd(),
      loader: {
        ".js": "js",
        ".css": "css",
        ".scss": "css",
        ".svg": "dataurl",
        ".png": "dataurl",
        ".jpg": "dataurl",
        ".woff": "file",
        ".woff2": "file",
      },
      assetNames: "assets/[name]-[hash]",
    });

    console.log("✅ JS bundling completed successfully!");
    
    // Verify output
    if (fs.existsSync("dist/js/ewds.min.js")) {
      const stats = fs.statSync("dist/js/ewds.min.js");
      console.log(`📄 Output: dist/js/ewds.min.js (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    }
  } catch (err) {
    console.error("❌ Build failed:", err);
    process.exit(1);
  } finally {
    // Cleanup
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
}

// Export for use in Gulp if needed
export { bundleAll };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  bundleAll();
}