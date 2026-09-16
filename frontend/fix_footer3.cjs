const fs = require('fs');

const content = fs.readFileSync('src/components/layout/footer.tsx', 'utf8');

let newContent = content;

// Replace exactly the old text with regex to ignore strange encodings
const regex = /<div className="text-\[10px\] text-muted-foreground uppercase tracking-widest font-sans text-center\\s*md:text-left">[\s\S]*?<\/div>/m;
newContent = newContent.replace(regex, `<div className="text-[10px] text-muted-foreground uppercase tracking-widest font-sans text-center md:text-left">
            &copy; 2026 DINARP &middot; Direcci&oacute;n Nacional de Registros P&uacute;blicos. Todos los derechos reservados.
          </div>`);

fs.writeFileSync('src/components/layout/footer.tsx', newContent, 'utf8');
