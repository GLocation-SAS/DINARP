const fs = require('fs');
let content = fs.readFileSync('src/modules/uikit/components/card-showcase.tsx', 'utf8');

// Replace opacity-30 with opacity-20 inside CardDecorativeIcon
content = content.replace(/<CardDecorativeIcon className="opacity-30">/g, '<CardDecorativeIcon className="opacity-20">');

fs.writeFileSync('src/modules/uikit/components/card-showcase.tsx', content, 'utf8');
