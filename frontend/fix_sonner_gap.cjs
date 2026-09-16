const fs = require('fs');
let content = fs.readFileSync('src/components/ui/sonner.tsx', 'utf8');

content = content.replace('!gap-3', '!gap-5'); // Aumentar el espacio entre icono y descripcion

fs.writeFileSync('src/components/ui/sonner.tsx', content, 'utf8');
