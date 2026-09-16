const fs = require('fs');
let content = fs.readFileSync('src/components/ui/file-input.tsx', 'utf8');

// Remove the hover animation for the outer circle
content = content.replace(
  /"opacity-0 group-hover:animate-ping group-hover:opacity-40 group-hover:scale-150"/g,
  '"opacity-0"'
);

fs.writeFileSync('src/components/ui/file-input.tsx', content, 'utf8');
