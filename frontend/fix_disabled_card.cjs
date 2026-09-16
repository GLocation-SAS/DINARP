const fs = require('fs');

const content = fs.readFileSync('src/modules/uikit/components/data-showcase.tsx', 'utf8');

let newContent = content.replace(
  '            <InteractiveCard\n              title="Reporte Amenazas Julio 2026"\n              subtitle="Nacional"\n              description="PDF  Generado 31/07/2026"\n              icon={<BarChart3 className="size-5" />}\n              disabled\n            />',
  '            <InteractiveCard\n              title="Reporte Amenazas Julio 2026"\n              subtitle="Nacional"\n              description="PDF — Generado 31/07/2026"\n              icon={<BarChart3 className="size-5" />}\n              decorativeIcon={<FileText className="size-full" />}\n            />'
);

// We might have an encoding issue with the description, let's use regex
const regex = /<InteractiveCard[\s\S]*?title="Reporte Amenazas Julio 2026"[\s\S]*?\/>/;
newContent = content.replace(regex, `          <InteractiveCard
            title="Reporte Amenazas Julio 2026"
            subtitle="Nacional"
            description="PDF — Generado 31/07/2026"
            icon={<BarChart3 className="size-5" />}
            decorativeIcon={<FileText className="size-full" />}
          />`);

fs.writeFileSync('src/modules/uikit/components/data-showcase.tsx', newContent, 'utf8');
