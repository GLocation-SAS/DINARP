const fs = require('fs');
let content = fs.readFileSync('src/modules/uikit/components/style-guide.tsx', 'utf8');

// Currently, Favicon isn't using a placeholder block but LogoManagerCard. 
// "Favicon Light" might be referring to `defaultLightImg="/favicon.ico"` in LogoManagerCard.
// The user says "Favicon Light igual aqui", maybe they mean the Favicon card has a missing resource as well? Let's check where we have "Favicon" in style-guide.
