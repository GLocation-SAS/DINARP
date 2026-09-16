const fs = require('fs');
let content = fs.readFileSync('src/modules/uikit/components/forms-filters-showcase.tsx', 'utf8');

const regex = /\{\/\* RANGE SLIDER \*\/\}\s*<SubSection\s*icon=\{SlidersHorizontal\} id="range-slider"\s*registerSection=\{registerSection\}\s*title="Range Slider"\s*description="Variante para seleccionar un rango mínimo y máximo\."\s*>\s*<div className="flex flex-col gap-6 max-w-sm">\s*<div className="space-y-4">\s*<div className="flex justify-between items-center">\s*<span className="text-sm font-medium">Rango de altitud<\/span>\s*<span className="text-sm text-muted-foreground">\{rangeVal\[0\]\}m - \{rangeVal\[1\]\}m<\/span>\s*<\/div>\s*<Slider value=\{rangeVal\} onValueChange=\{setRangeVal\} max=\{100\} step=\{1\} \/>\s*<\/div>\s*<\/div>\s*<\/SubSection>/g;

content = content.replace(regex, '');

fs.writeFileSync('src/modules/uikit/components/forms-filters-showcase.tsx', content, 'utf8');
