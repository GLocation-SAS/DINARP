const fs = require('fs');
let content = fs.readFileSync('src/modules/uikit/components/reports-export-showcase.tsx', 'utf8');

// The section is something like:
//       <SubSection icon={Clock} id="report-status" title="Estado de Reporte" description="Proceso lógico de generación de un reporte: Preparando → Generando → Disponible / Error." registerSection={registerSection}>
//         <div className="...">
//           ... content ...
//         </div>
//       </SubSection>

// Let's use a regex to match from `<SubSection icon={Clock} id="report-status"` up to `</SubSection>`
// We have to be careful with nested `<SubSection>` but here there shouldn't be any.

const regex = /<SubSection icon=\{Clock\} id="report-status"[\s\S]*?<\/SubSection>/g;
content = content.replace(regex, '');

fs.writeFileSync('src/modules/uikit/components/reports-export-showcase.tsx', content, 'utf8');
