const fs = require('fs');
let content = fs.readFileSync('src/components/ui/file-upload.tsx', 'utf8');

// Replace all variant="secondary" with variant="neutral"
content = content.replace(/variant="secondary"/g, 'variant="neutral"');

fs.writeFileSync('src/components/ui/file-upload.tsx', content, 'utf8');
