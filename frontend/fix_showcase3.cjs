const fs = require('fs');

const content = fs.readFileSync('src/modules/uikit/components/data-showcase.tsx', 'utf8');

// Seems my previous fix failed for some reason, let's just do a blanket regex to strip that "/>}\n disabled \n />" garbage
let newContent = content.replace(/\/>\}\s*disabled\s*\/>/g, '/>');

fs.writeFileSync('src/modules/uikit/components/data-showcase.tsx', newContent, 'utf8');
