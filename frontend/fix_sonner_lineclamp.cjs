const fs = require('fs');
let content = fs.readFileSync('src/components/ui/sonner.tsx', 'utf8');

content = content.replace(
  /title: `\n\s*text-\[14px\]\n\s*!text-foreground\n\s*font-medium\n\s*leading-snug\n\s*text-left\n\s*w-full\n\s*!m-0\n\s*`/,
  `title: \`
              text-[14px]
              !text-foreground
              font-medium
              leading-snug
              text-left
              w-full
              !m-0
              line-clamp-2
            \``
);

fs.writeFileSync('src/components/ui/sonner.tsx', content, 'utf8');
