const fs = require('fs');

const p = 'src/app/wireframes2/novedades/page.tsx';
let content = fs.readFileSync(p, 'utf8');

let startIndex = content.indexOf('<WireframeBreadcrumbs');
let endIndex = content.indexOf('/>', startIndex) + 2;

let newBreadcrumbs = `        <WireframeBreadcrumbs 
          segments={[
            { label: "Inicio", href: "/wireframes2" },
            { label: "Novedades del Catálogo", href: "/wireframes2/novedades" }
          ]}
        />`;

content = content.substring(0, startIndex) + newBreadcrumbs + content.substring(endIndex);
fs.writeFileSync(p, content);
console.log('Replaced by index');
