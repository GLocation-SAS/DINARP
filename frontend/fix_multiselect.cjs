const fs = require('fs');
let content = fs.readFileSync('src/components/ui/multiselect.tsx', 'utf8');

// Replace the single chip badge
content = content.replace(
  /<Badge\s+key=\{opt.value\}\s+tone="secondary"\s+className="px-2 py-0.5 font-medium h-6 rounded-md gap-1 bg-primary\/10 text-primary hover:bg-primary\/20 border-0 shrink-0"/g,
  '<Badge key={opt.value} tone="neutral" appearance="soft" className="px-3 py-0.5 font-medium h-7 rounded-full gap-1 shrink-0">'
);

// Replace the grouped "+X" badge
content = content.replace(
  /<Badge tone="secondary" className="px-2 py-0.5 font-medium h-6 rounded-md bg-primary\/10 text-primary hover:bg-primary\/20 border-0 shrink-0">/g,
  '<Badge tone="neutral" appearance="soft" className="px-3 py-0.5 font-medium h-7 rounded-full shrink-0">'
);

fs.writeFileSync('src/components/ui/multiselect.tsx', content, 'utf8');
