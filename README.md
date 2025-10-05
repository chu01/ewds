# Ethiopian Web Design System (EWDS)

A modular lightweight, independent design system inspired by USWDS.

## 📦 Structure

\`\`\`
ewds/
├── src/
│   ├── styles/
│   │   └── core/               # Tokens, mixins, functions
│   ├── packages/               # Independent components
│   │   ├── button/
│   │   ├── header/
│   │   ├── banner/
│   │   ├── footer/
│   │   ├── modal/
│   │   └── card/
│   └── js/
│       └── ethiogov.js         # Main entry point
└── dist/                       # Compiled output
\`\`\`

## 🚀 Build

```bash
npm install
npm run build
