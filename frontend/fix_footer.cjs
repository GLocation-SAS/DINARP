const fs = require('fs');

const content = fs.readFileSync('src/components/layout/footer.tsx', 'utf8');

let newContent = content;

// Replace Description
newContent = newContent.replace(
    'Sistema centralizado para la gestin, visualizacin y anǭlisis de datos geoespaciales y riesgos a nivel nacional.',
    'Plataforma para facilitar la gestión de los procesos de interoperabilidad entre instituciones, centralizando solicitudes, autorizaciones y el seguimiento del intercambio de información.'
);

// Replace Title "DINARP"
newContent = newContent.replace(
    '<span className="text-xl font-heading font-black tracking-tight">\n                GLocation <span className="text-primary">DINARP</span>\n              </span>',
    '<span className="text-xl font-heading font-black tracking-tight">\n                DINARP\n              </span>'
);

// Replace Columns
const columnsRegex = /\{?\/\* Column 2: Producto \*\/[\s\S]*?\{?\/\* Bottom Bar: Copyright & Socials \*\//;
const newColumns = `
          {/* Column 2: Plataforma */}
          <div className="flex flex-col items-start text-left">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest font-heading mb-6 flex items-center gap-2">
              Plataforma
            </h3>
            <ul className="flex flex-col items-start font-sans text-body-sm text-muted-foreground gap-3.5">
              <li><Link href="/" className="hover:text-primary transition-colors duration-200">Inicio</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors duration-200">Interoperabilidad</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors duration-200">Solicitudes</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors duration-200">Centro de ayuda</Link></li>
            </ul>
          </div>

          {/* Column 3: Información */}
          <div className="flex flex-col items-start text-left">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest font-heading mb-6 flex items-center gap-2">
              Información
            </h3>
            <ul className="flex flex-col items-start font-sans text-body-sm text-muted-foreground gap-3.5">
              <li><Link href="#" className="hover:text-primary transition-colors duration-200">Acerca de DINARP</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors duration-200">Documentación</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors duration-200">Contacto</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="flex flex-col items-start text-left">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-widest font-heading mb-6 flex items-center gap-2">
              Legal
            </h3>
            <ul className="flex flex-col items-start font-sans text-body-sm text-muted-foreground gap-3.5">
              <li><Link href="#" className="hover:text-primary transition-colors duration-200">Política de privacidad</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors duration-200">Términos y condiciones</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors duration-200">Tratamiento de datos</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright & Socials */}
`;
newContent = newContent.replace(columnsRegex, newColumns);

// Replace Copyright
newContent = newContent.replace(
    '© 2026 GLocation S.A.S. — DINARP — Sistema de Gestin de Riesgos. Todos los derechos reservados.',
    '© 2026 DINARP · Dirección Nacional de Registros Públicos. Todos los derechos reservados.'
);
newContent = newContent.replace(
    ' 2026 GLocation S.A.S.  DINARP ?" Sistema de Gestin de Riesgos. Todos los derechos reservados.',
    '© 2026 DINARP · Dirección Nacional de Registros Públicos. Todos los derechos reservados.'
);

fs.writeFileSync('src/components/layout/footer.tsx', newContent, 'utf8');
