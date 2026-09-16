const fs = require('fs');
let content = fs.readFileSync('src/components/ui/checkbox.tsx', 'utf8');

content = content.replace(/data-\[state=checked\]:text-[a-z]+-foreground/g, 'data-[state=checked]:text-white');
// Ensure dark mode isn't duplicated redundantly, but it doesn't hurt.
// Actually, it had `dark:data-[state=checked]:text-white` already. We can leave it.

fs.writeFileSync('src/components/ui/checkbox.tsx', content, 'utf8');
