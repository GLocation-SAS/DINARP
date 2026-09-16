const fs = require('fs');
let content = fs.readFileSync('src/components/ui/card.tsx', 'utf8');

// The default opacity is 15. The user wants them to match the color and have less opacity.
// The showcase was explicitly setting opacity-30 or opacity-20. Let's remove the explicit opacity overrides in showcase so it falls back to the default `opacity-15` or we set it to `opacity-20` in the showcase. I already set it to `opacity-20`.

let showcaseContent = fs.readFileSync('src/modules/uikit/components/card-showcase.tsx', 'utf8');
showcaseContent = showcaseContent.replace(/<CardDecorativeIcon className="opacity-20">/g, '<CardDecorativeIcon>');
fs.writeFileSync('src/modules/uikit/components/card-showcase.tsx', showcaseContent, 'utf8');
