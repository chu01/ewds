// ===============================================
// Ethiopian Web Design System (EWDS)
// Main entry point
// ===============================================

// Core utilities
// import "./packages/core/_mixins.js"; // if you have any shared JS utilities
// import "./packages/core/_helpers.js"; // optional
import "../packages/ewds-core/src/js/index.js"
// import "./packages/ewds-core/src/js/index.js"

// Components
// import "./packages/components/button/button.js";
// import "./packages/components/accordion/accordion.js";
// import "./packages/components/modal/modal.js";
// ...add more as you build them

// Initialize function — runs any setup logic
export function initEWDS() {
  console.log("✨ Ethiopian Web Design System initialized");
  // Add global setup logic here, e.g.:
  // - attach event listeners
  // - initialize modals or accordions
  // - scan for data attributes (like data-ewds-component)
}

// Auto-init when loaded in browser via <script>
if (typeof window !== "undefined") {
  window.EWDS = { init: initEWDS };
  document.addEventListener("DOMContentLoaded", () => {
    initEWDS();
  });
}
