const fs = require('fs');

const content = fs.readFileSync('src/components/layout/footer.tsx', 'utf8');

let newContent = content;

// Use regex to catch the encoding variations
const copyRegex = / 2026 GLocation S\.A\.S\.  DINARP \?" Sistema de Gestin de Riesgos\. Todos los derechos reservados\./g;

newContent = newContent.replace(copyRegex, '© 2026 DINARP · Dirección Nacional de Registros Públicos. Todos los derechos reservados.');

fs.writeFileSync('src/components/layout/footer.tsx', newContent, 'utf8');
