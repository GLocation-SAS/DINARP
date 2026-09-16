const fs = require('fs');
let content = fs.readFileSync('src/components/layout/footer.tsx', 'utf8');

// The file still has the rogue "}\n      <div className="w-full border-t border-border/60 bg-surface">" from my previous failed replacement.
content = content.replace('      {/* Bottom Bar: Copyright & Socials */}\n}\n      <div className="w-full border-t border-border/60 bg-surface">', '      {/* Bottom Bar: Copyright & Socials */}\n      <div className="w-full border-t border-border/60 bg-surface">');

fs.writeFileSync('src/components/layout/footer.tsx', content, 'utf8');
