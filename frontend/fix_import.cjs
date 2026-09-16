const fs = require('fs');
let content = fs.readFileSync('src/modules/uikit/components/forms-filters-showcase.tsx', 'utf8');

if (!content.includes('import { Badge }')) {
    content = content.replace(
        /import \{ Button \} from "@\/components\/ui\/button";/,
        `import { Button } from "@/components/ui/button";\nimport { Badge } from "@/components/ui/badge";`
    );
}

fs.writeFileSync('src/modules/uikit/components/forms-filters-showcase.tsx', content, 'utf8');
