/**
 * src/consts.ts
 * Backward-compatibility shim — re-exports from settings.ts
 * so any existing pages using SITE_TITLE / SITE_DESCRIPTION still work
 * without modification. Gradually migrate pages to import from settings.ts directly.
 */
export { SITE_TITLE, SITE_DESCRIPTION } from './lib/settings';
