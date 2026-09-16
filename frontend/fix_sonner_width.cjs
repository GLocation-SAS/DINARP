const fs = require('fs');

let content = fs.readFileSync('src/components/ui/sonner.tsx', 'utf8');

// The issue might be that right padding isn't enough to balance the roundness of the pill, 
// OR the min-width is forcing the pill to be too wide, leaving empty space on the right.
// Let's remove !min-w-[300px] entirely so the toast hugs its content.
// Sonner uses w-full by default. Let's add !w-auto !min-w-0 !max-w-fit so it's as compact as possible.
content = content.replace('!min-w-[300px]', '!w-fit !min-w-fit !pr-5'); // added a tiny bit of extra right padding because pills optically need more side padding

fs.writeFileSync('src/components/ui/sonner.tsx', content, 'utf8');
