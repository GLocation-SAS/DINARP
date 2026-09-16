const fs = require('fs');

let content = fs.readFileSync('src/modules/uikit/components/footer-showcase.tsx', 'utf8');

// Replace the iframe in footer-showcase with `<Footer />`
// Wait, the Footer is `import { Footer } from "@/components/layout/footer";`

let newContent = content.replace(
  'import { Button } from "@/components/ui/button";',
  'import { Button } from "@/components/ui/button";\nimport { Footer } from "@/components/layout/footer";'
);

newContent = newContent.replace(
  /<iframe[\s\S]*?\/>/g,
  '<div className="w-full min-h-[400px] flex flex-col justify-end border-none bg-background pointer-events-auto">\n              <Footer />\n            </div>'
);

fs.writeFileSync('src/modules/uikit/components/footer-showcase.tsx', newContent, 'utf8');

