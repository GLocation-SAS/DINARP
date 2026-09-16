const fs = require('fs');

const content = fs.readFileSync('src/components/layout/footer.tsx', 'utf8');
// Fix the syntax error that keeps failing
const newContent = content.replace('      {/* Bottom Bar: Copyright & Socials */}\n}\n      <div className="w-full border-t border-border/60 bg-surface">', '      {/* Bottom Bar: Copyright & Socials */}\n      <div className="w-full border-t border-border/60 bg-surface">');

fs.writeFileSync('src/components/layout/footer.tsx', newContent, 'utf8');
