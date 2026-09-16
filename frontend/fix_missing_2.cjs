const fs = require('fs');

let content = fs.readFileSync('src/modules/uikit/components/style-guide.tsx', 'utf8');

content = content.replace(/<span className="text-xs text-muted-foreground\/60 mt-1 max-w-\[200px\]">Este imagotipo aún no ha sido provisto\.<\/span>/g, '<span className="text-xs text-muted-foreground/60 mt-1 max-w-[200px]">falta el recurso oficial del manual de marca</span>');

fs.writeFileSync('src/modules/uikit/components/style-guide.tsx', content, 'utf8');
