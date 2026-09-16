const fs = require('fs');

const content = fs.readFileSync('src/modules/uikit/components/data-showcase.tsx', 'utf8');
const newContent = content.replace('          />}\n            disabled\n          />', '');

fs.writeFileSync('src/modules/uikit/components/data-showcase.tsx', newContent, 'utf8');
