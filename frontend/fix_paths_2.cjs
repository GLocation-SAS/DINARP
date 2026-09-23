const fs = require('fs');

const p1 = 'src/app/wireframes2/catalogo-interoperabilidad/administracion/incorporaciones/[id]/expediente-client-view.tsx';
const p2 = 'src/app/wireframes2/catalogo-interoperabilidad/administracion/incorporaciones/[id]/page.tsx';

if (fs.existsSync(p1)) {
  let content = fs.readFileSync(p1, 'utf8');
  content = content.replace(/from "\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/components\/wireframe-dashboard-layout";/g, 'from "../../../../components/wireframe-dashboard-layout";');
  content = content.replace(/from "\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/components\/wireframe-breadcrumbs";/g, 'from "../../../../components/wireframe-breadcrumbs";');
  content = content.replace(/from "\.\.\/\.\.\/\.\.\/\.\.\/hooks\/use-simulated-role";/g, 'from "../../../hooks/use-simulated-role";');
  content = content.replace(/from "\.\.\/\.\.\/\.\.\/\.\.\/data\/catalogo-data";/g, 'from "../../../data/catalogo-data";');
  fs.writeFileSync(p1, content);
  console.log('Fixed', p1);
}

if (fs.existsSync(p2)) {
  let content = fs.readFileSync(p2, 'utf8');
  content = content.replace(/from "\.\.\/\.\.\/\.\.\/\.\.\/data\/catalogo-data";/g, 'from "../../../data/catalogo-data";');
  fs.writeFileSync(p2, content);
  console.log('Fixed', p2);
}
