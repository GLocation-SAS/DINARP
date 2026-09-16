const fs = require('fs');

let content = fs.readFileSync('src/components/ui/sonner.tsx', 'utf8');

content = content.replace(
  /title: `\s*hidden\s*`,/g,
  `title: \`
            text-[14px]
            !text-foreground
            font-medium
            leading-snug
            text-left
            w-full
            !m-0
          \`,`
);

content = content.replace(
  /description: `\s*text-\[14px\]\s*!text-foreground\s*font-medium\s*leading-snug\s*text-left\s*w-full\s*!m-0\s*`,/g,
  `description: \`
            hidden
          \`,`
);

fs.writeFileSync('src/components/ui/sonner.tsx', content, 'utf8');
