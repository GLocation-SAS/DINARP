const fs = require('fs');

const paths = [
  'src/app/wireframes2/catalogo-interoperabilidad/administracion/incorporaciones/nueva/page.tsx',
  'src/app/wireframes2/catalogo-interoperabilidad/administracion/incorporaciones/[id]/expediente-client-view.tsx',
  'src/app/wireframes2/catalogo-interoperabilidad/administracion/incorporaciones/[id]/page.tsx'
];

paths.forEach(p => {
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    
    if (p.includes('[id]')) {
      content = content.replace(/from ".*components\/wireframe-dashboard-layout";/g, 'from "../../../../../components/wireframe-dashboard-layout";');
      content = content.replace(/from ".*components\/wireframe-breadcrumbs";/g, 'from "../../../../../components/wireframe-breadcrumbs";');
      content = content.replace(/from ".*hooks\/use-simulated-role";/g, 'from "../../../../hooks/use-simulated-role";');
      content = content.replace(/from ".*data\/catalogo-data";/g, 'from "../../../../data/catalogo-data";');
    } else {
      content = content.replace(/from ".*components\/wireframe-dashboard-layout";/g, 'from "../../../../components/wireframe-dashboard-layout";');
      content = content.replace(/from ".*components\/wireframe-breadcrumbs";/g, 'from "../../../../components/wireframe-breadcrumbs";');
      content = content.replace(/from ".*hooks\/use-simulated-role";/g, 'from "../../../hooks/use-simulated-role";');
      content = content.replace(/from ".*data\/catalogo-data";/g, 'from "../../../data/catalogo-data";');
    }
    
    fs.writeFileSync(p, content);
    console.log('Fixed', p);
  }
});
