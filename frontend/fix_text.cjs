const fs = require('fs');

const content = fs.readFileSync('src/app/construccion/page.tsx', 'utf8');

const regex = /Nuestros ingenieros[\s\S]*?Geoportal\./;
const replacement = `Estamos preparando nuevas funcionalidades para la plataforma DINARP.
          <br /><br />
          Trabajamos para ofrecerte una experiencia más ágil y eficiente en la gestión de los procesos de interoperabilidad.`;

const newContent = content.replace(regex, replacement);

fs.writeFileSync('src/app/construccion/page.tsx', newContent, 'utf8');
