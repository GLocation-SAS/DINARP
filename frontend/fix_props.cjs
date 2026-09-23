const fs = require('fs');

const p1 = 'src/app/wireframes2/novedades/detalle/page.tsx';
const p2 = 'src/app/wireframes2/novedades/page.tsx';

if (fs.existsSync(p1)) {
  let content = fs.readFileSync(p1, 'utf8');
  content = content.replace(/tone="outline"/g, 'variant="outline"');
  fs.writeFileSync(p1, content);
}
if (fs.existsSync(p2)) {
  let content = fs.readFileSync(p2, 'utf8');
  content = content.replace(/tone="outline"/g, 'variant="outline"');
  fs.writeFileSync(p2, content);
}
