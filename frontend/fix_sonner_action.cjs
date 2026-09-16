const fs = require('fs');
let content = fs.readFileSync('src/components/ui/sonner.tsx', 'utf8');

// The actionButton right now is using badgeVariants primary soft.
// "el badge usa uno del ui kit, porfa el neutral con escala" -> tone="neutral", appearance="outline" (or solid/soft? Since she said "escala", maybe outline, or just default badge with tone neutral. "escala" probably means scale, but badge doesn't have an "escala" appearance, maybe tone="neutral", appearance="solid"?
// Wait, the badgeVariants have `tone` (neutral) and `appearance` (solid, soft, outline).
content = content.replace(
  /actionButton: badgeVariants\(\{ tone: "primary", appearance: "soft", className: "hover:opacity-80 cursor-pointer px-4 py-2" \}\)/,
  'actionButton: badgeVariants({ tone: "neutral", appearance: "solid", className: "hover:opacity-80 cursor-pointer px-4 py-2" })'
);

// Loading is currently a rounded-full icon.
// "a estado promise anlineado el este de carga, y lo mismo en duiración de cargba"
// The issue is probably the `shrink-0 size-10 rounded-full` might not be perfectly centered or its wrapper needs alignment.
// In Sonner, the `loader` class handles the loading wrapper. Let's make sure it is centered just like `icon`.
// Wait, maybe the `icon` in the custom toast is an icon she passed directly and it's not aligned?
// In `toast-showcase.tsx`, for "Estado Promise" she used a standard `.promise()` which uses the `loading:` icon.
// Let's check `toast-showcase.tsx`.

fs.writeFileSync('src/components/ui/sonner.tsx', content, 'utf8');
