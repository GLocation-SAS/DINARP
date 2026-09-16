const fs = require('fs');
let content = fs.readFileSync('src/modules/uikit/components/style-guide.tsx', 'utf8');

// Find the grid container
const gridStart = content.indexOf('<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">');
const gridEnd = content.indexOf('</div>', gridStart);

if (gridStart !== -1 && gridEnd !== -1) {
  const newGridContent = `<div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
            {/* Card 1: Horizontal (was previously sin lema) */}
            <LogoManagerCard
              slot="horizontal"
              title="Logotipo Horizontal"
              description="Versión principal del logotipo. Recomendada para encabezados, páginas web, documentos y espacios horizontales."
              badge1="HORIZONTAL"
              badge2="PRINCIPAL"
              defaultLightImg="/logotipo.png"
              defaultDarkImg="/logotipo.png"
              monoLightImg="/logotipo.png"
              monoDarkImg="/logotipo.png"
            />
  
            {/* Card 2: Vertical */}
            <LogoManagerCard
              slot="vertical"
              title="Logotipo Vertical"
              description="Versión alternativa para espacios más estrechos o composiciones verticales, donde el logotipo horizontal no se adapta correctamente."
              badge1="VERTICAL"
              badge2="SECUNDARIO"
              defaultLightImg="/Logo-vertical.svg"
              defaultDarkImg="/Logo-vertical-alternativo.svg"
              monoLightImg="/Logo-vertical-negro.svg"
              monoDarkImg="/Logo-vertical-blanco.svg"
            />
  
            {/* Card 3: Favicon */}
            <LogoManagerCard
              slot="favicon"
              title="Favicon"
              description="Versión simplificada del símbolo que identifica el sitio en la pestaña del navegador y en espacios digitales de tamaño muy pequeño."
              badge1="FAVICON"
              badge2="MÍNIMO"
              defaultLightImg="/Favicon.svg"
              defaultDarkImg="/Favicon alternativo.svg"
              editLabel="Editar favicon"
            />`;
  
  content = content.substring(0, gridStart) + newGridContent + content.substring(gridEnd);
  fs.writeFileSync('src/modules/uikit/components/style-guide.tsx', content, 'utf8');
}
