/// <reference types="vite/client" />

// `?raw` imports of .md files (used by the presenter view to load
// ShopIt-Speech-v2.md verbatim). Vite handles the suffix at build time; this
// declaration just teaches TypeScript that the import resolves to a string.
declare module "*.md?raw" {
  const content: string;
  export default content;
}

