const fs = require('fs');
let content = fs.readFileSync('src/components/ui/multiselect.tsx', 'utf8');
content = content.replace(/className="px-3 py-0\.5 font-medium h-7 rounded-full gap-1 shrink-0">\s*>/g, 'className="px-3 py-0.5 font-medium h-7 rounded-full gap-1 shrink-0">');
fs.writeFileSync('src/components/ui/multiselect.tsx', content, 'utf8');
