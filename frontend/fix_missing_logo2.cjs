const fs = require('fs');

let content = fs.readFileSync('src/modules/uikit/components/logo-manager-card.tsx', 'utf8');

// I need to import ImageOff from lucide-react
content = content.replace(
  'import { Download, Edit2, Check, Sun, Moon } from "lucide-react";',
  'import { Download, Edit2, Check, Sun, Moon, ImageOff } from "lucide-react";'
);

fs.writeFileSync('src/modules/uikit/components/logo-manager-card.tsx', content, 'utf8');

// And I need to set isMissing={true} for Favicon in style-guide.tsx 
let content2 = fs.readFileSync('src/modules/uikit/components/style-guide.tsx', 'utf8');
content2 = content2.replace(
  '            <LogoManagerCard\n              slot="favicon"',
  '            <LogoManagerCard\n              isMissing={true}\n              slot="favicon"'
);

// We probably also want to set isMissing={true} for "Logotipo Vertical" which was the other one that was missing.
content2 = content2.replace(
  '            <LogoManagerCard\n              slot="vertical"',
  '            <LogoManagerCard\n              isMissing={true}\n              slot="vertical"'
);

fs.writeFileSync('src/modules/uikit/components/style-guide.tsx', content2, 'utf8');

