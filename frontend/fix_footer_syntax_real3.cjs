const fs = require('fs');
let content = fs.readFileSync('src/components/layout/footer.tsx', 'utf8');

// The file still has the rogue "}\n      <div className="w-full border-t border-border/60 bg-surface">"
// We need to use regex properly because replacing literal newlines is failing in PS/Node somehow, maybe because of \r\n vs \n
content = content.replace(/\{\/\* Bottom Bar: Copyright & Socials \*\/\}\r?\n\}\r?\n\s*<div className="w-full border-t border-border\/60 bg-surface">/g, '{/* Bottom Bar: Copyright & Socials */}\n      <div className="w-full border-t border-border/60 bg-surface">');

fs.writeFileSync('src/components/layout/footer.tsx', content, 'utf8');
