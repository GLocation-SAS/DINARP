const fs = require('fs');
let content = fs.readFileSync('src/components/ui/sonner.tsx', 'utf8');

content = content.replace(/<div className="flex items-center justify-center shrink-0 size-10 rounded-lg bg-success text-white shadow-sm">\s*<CircleCheckIcon className="size-5 stroke-\[2px\]" \/>\s*<\/div>/g, '<div className="flex items-center justify-center shrink-0"><CircleCheckIcon className="size-8 text-card fill-success" /></div>');
content = content.replace(/<div className="flex items-center justify-center shrink-0 size-10 rounded-lg bg-info text-white shadow-sm">\s*<InfoIcon className="size-5 stroke-\[2px\]" \/>\s*<\/div>/g, '<div className="flex items-center justify-center shrink-0"><InfoIcon className="size-8 text-card fill-info-600" /></div>');
content = content.replace(/<div className="flex items-center justify-center shrink-0 size-10 rounded-lg bg-warning text-white shadow-sm">\s*<TriangleAlertIcon className="size-5 stroke-\[2px\]" \/>\s*<\/div>/g, '<div className="flex items-center justify-center shrink-0"><TriangleAlertIcon className="size-8 text-card fill-warning-500" /></div>');
content = content.replace(/<div className="flex items-center justify-center shrink-0 size-10 rounded-lg bg-danger text-white shadow-sm">\s*<OctagonXIcon className="size-5 stroke-\[2px\]" \/>\s*<\/div>/g, '<div className="flex items-center justify-center shrink-0"><OctagonXIcon className="size-8 text-card fill-danger" /></div>');

fs.writeFileSync('src/components/ui/sonner.tsx', content, 'utf8');
