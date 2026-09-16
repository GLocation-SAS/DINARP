const fs = require('fs');
let content = fs.readFileSync('src/components/ui/sonner.tsx', 'utf8');

// Ensure space around toast icon is balanced. Right now the icon has !mr-2 removed or it is 0. 
// Wait, !gap-4 is handling the spacing between icon and text.
// And padding is !p-3.5
// The image shows that padding left might be smaller than padding right. Actually, !pr-5 or !pr-6 is usually better for pills. Let's make it equal.
// !p-3.5 is equal padding on all sides. Let's change it to !p-3 for a bit tighter look or just leave it. The padding looks good.
// The image icon has gap with text. !gap-3 is usually better for pills.
content = content.replace('!gap-4', '!gap-3');
content = content.replace('!p-3.5', '!p-3 !pr-5'); // A bit more padding on the right to balance the pill optical illusion, or let's just make it perfectly symmetrical !p-3.5. But if user says "tener mismo espacio arriba abajo derecha izquierda", let's make it !p-3.5 and remove any other margins.

// Wait, the user uploaded an image. The user says: "deve verse bien tener mismo espacio arriba abajo derecha izquierda".
// I will ensure `!p-3.5` or `!p-4` is uniform.
content = content.replace('!p-3 !pr-5', '!p-3.5');
content = content.replace('!min-w-[340px]', '!min-w-[300px]'); // Shrink a bit so it doesn't look empty on the right.

fs.writeFileSync('src/components/ui/sonner.tsx', content, 'utf8');

// For Alert
let alertContent = fs.readFileSync('src/components/ui/alert.tsx', 'utf8');
alertContent = alertContent.replace('p-4 sm:p-5 pr-6', 'p-4 sm:p-5');
fs.writeFileSync('src/components/ui/alert.tsx', alertContent, 'utf8');
