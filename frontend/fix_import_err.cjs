const fs = require('fs');
let content = fs.readFileSync('src/modules/uikit/components/style-guide.tsx', 'utf8');
content = content.replace(/Image as Image as ImageIcon/g, 'Image as ImageIcon');
fs.writeFileSync('src/modules/uikit/components/style-guide.tsx', content, 'utf8');
