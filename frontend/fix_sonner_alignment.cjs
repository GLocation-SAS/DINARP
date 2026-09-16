const fs = require('fs');
let content = fs.readFileSync('src/components/ui/sonner.tsx', 'utf8');

// For "estado promise anlineado el este de carga": The loading icon and custom icons might not be vertically centered due to some flex/margin issues.
// Let's check `icon` and `loader` classNames.
content = content.replace(
  /icon: `\n\s*!static\n\s*!shrink-0\n\s*!flex\n\s*!items-center\n\s*!justify-center\n\s*!m-0\n\s*`/,
  `icon: \`
            !static
            !shrink-0
            !flex
            !items-center
            !justify-center
            !m-0
            !self-center
          \``
);

content = content.replace(
  /loader: `\n\s*!static\n\s*!shrink-0\n\s*!flex\n\s*!m-0\n\s*`/,
  `loader: \`
            !static
            !shrink-0
            !flex
            !items-center
            !justify-center
            !m-0
            !self-center
          \``
);

fs.writeFileSync('src/components/ui/sonner.tsx', content, 'utf8');
