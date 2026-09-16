const fs = require('fs');
let content = fs.readFileSync('src/components/ui/sonner.tsx', 'utf8');

content = content.replace('!p-3.5', '!p-3.5 !pl-4'); // Added padding on the left to give the icon some space

fs.writeFileSync('src/components/ui/sonner.tsx', content, 'utf8');
