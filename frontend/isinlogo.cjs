const fs = require('fs');

let content = fs.readFileSync('src/modules/uikit/components/logo-manager-card.tsx', 'utf8');
console.log(content.includes('Descargar SVG'));
