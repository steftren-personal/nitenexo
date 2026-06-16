// Ambient declarations so the TypeScript language server accepts side-effect
// stylesheet imports like `import "./globals.css"`. Next.js handles these at
// build time, but the editor's TS server needs this to avoid TS2882 (and to
// stop auto-fixes from mangling the import path).
declare module "*.css";
declare module "*.scss";
