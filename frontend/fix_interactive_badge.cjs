const fs = require('fs');

const content = fs.readFileSync('src/components/ui/data-display.tsx', 'utf8');

// Replace Badge className override and just use neutral soft
const regex = /<Badge appearance="soft" tone=\{color === "default" \|\| color === "purple" \? "neutral" : color\} className=\{\`text-\[10px\] px-2 py-0\.5 mb-2 shadow-none border-transparent font-semibold z-10 \$\{color !== "default" \? "bg-" \+ color \+ "\/20 text-" \+ color : "bg-muted-foreground\/20 text-foreground"\}\`\}>/g;

let newContent = content.replace(regex, '<Badge appearance="soft" tone={color === "default" || color === "purple" ? "neutral" : color} className={cn("text-[10px] px-2 py-0.5 mb-2 shadow-none border-transparent font-semibold z-10", color !== "default" && "bg-" + color + "/20 text-" + color)}>');

fs.writeFileSync('src/components/ui/data-display.tsx', newContent, 'utf8');
