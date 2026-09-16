// The user wants these components to be shown "en el campo que es" (in their place directly) instead of as independent pages in iframes.
// They want the preview components (like Footer, Header, Notifications Menu, User Menu) to be rendered directly in the showcase component instead of being loaded via iframe pointing to Next.js routes.

// To do this, I need to refactor the showcase components:
// 1. `src/modules/uikit/components/footer-showcase.tsx`
// 2. `src/modules/uikit/components/navigation-showcase.tsx`

// In `footer-showcase.tsx`, replace the <iframe> with a direct render of `<Footer>` (or whatever the Footer preview uses).
// But they have `postMessage` to update config! If we render directly, we can just pass the config as props.

// Wait, let's see what `src/app/footer-preview/page.tsx` has.
