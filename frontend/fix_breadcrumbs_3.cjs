const fs = require('fs');

const p2 = 'src/app/wireframes2/novedades/page.tsx';
if (fs.existsSync(p2)) {
  let content = fs.readFileSync(p2, 'utf8');
  content = content.replace(/segments=\{\},\n\s*\{\s*label:\s*"Novedades[^]*?\]\}/g, 'segments={[\n            { label: "Inicio", href: "/wireframes2" },\n            { label: "Novedades del Catálogo", href: "/wireframes2/novedades" }\n          ]}');
  fs.writeFileSync(p2, content);
}
