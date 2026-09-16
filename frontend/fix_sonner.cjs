const fs = require('fs');
let content = fs.readFileSync('src/components/ui/sonner.tsx', 'utf8');

content = content.replace('!rounded-xl', '!rounded-full');
content = content.replace('!py-4\n            !px-6', '!p-3.5');
content = content.replace('!bg-surface\n            !border-border', '!bg-background\n            !border-border/30');

// Remove severity background colors to keep glassmorphism white/dark
content = content.replace(/group-\[\[data-type=.*\]\]:!bg-.*\n/g, '');
content = content.replace(/group-\[\[data-type=.*\]\]:!border-.*\n/g, '');

// Simplify typography
content = content.replace('text-[14px]\n            font-bold\n            tracking-tight\n            leading-tight', 'text-[14.5px]\n            font-medium\n            leading-snug');

// Remove dynamic title colors
content = content.replace(/\/\* Colores de título dinámicos \*\/[\s\S]*?(?=`,)/g, '');

fs.writeFileSync('src/components/ui/sonner.tsx', content, 'utf8');
