const fs = require('fs');

let content = fs.readFileSync('src/components/ui/alert.tsx', 'utf8');

// Remove lateral borders and left-flat rounding
content = content.replace('rounded-xl rounded-l-none border border-border/40 border-l-[4px]', 'rounded-xl border border-border/40');

// Remove color-specific left borders
content = content.replace(/border-l-[a-z/0-9]+/g, '');

fs.writeFileSync('src/components/ui/alert.tsx', content, 'utf8');
