const fs = require('fs');
let content = fs.readFileSync('src/components/ui/sonner.tsx', 'utf8');

content = content.replace('!p-3.5 !pl-4', '!py-3.5 !px-6');
content = content.replace('!w-fit !min-w-fit !pr-5', '!w-fit !min-w-fit'); // clean up old pr

fs.writeFileSync('src/components/ui/sonner.tsx', content, 'utf8');
