const fs = require('fs');

let content = fs.readFileSync('src/components/ui/sonner.tsx', 'utf8');

content = content.replace(
  /!text-foreground\n\s*`/,
  `!text-foreground

            /* Dark mode semantic backgrounds */
            dark:group-[[data-type=success]]:!bg-success/15
            dark:group-[[data-type=success]]:!border-success/20
            dark:group-[[data-type=info]]:!bg-info/15
            dark:group-[[data-type=info]]:!border-info/20
            dark:group-[[data-type=warning]]:!bg-warning/15
            dark:group-[[data-type=warning]]:!border-warning/20
            dark:group-[[data-type=error]]:!bg-danger/15
            dark:group-[[data-type=error]]:!border-danger/20
            dark:group-[[data-type=default]]:!bg-primary/15
            dark:group-[[data-type=default]]:!border-primary/20
          \``
);

fs.writeFileSync('src/components/ui/sonner.tsx', content, 'utf8');
