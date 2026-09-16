const fs = require('fs');
let content = fs.readFileSync('src/modules/uikit/components/card-showcase.tsx', 'utf8');

// Replace Primary
content = content.replace(
    '<CardTitle className="text-sm font-bold text-foreground">Product Design</CardTitle>',
    '<CardTitle className="text-sm font-bold text-primary">Product Design</CardTitle>'
).replace(
    '<CardDecorativeIcon className="opacity-30">\n                                <PenTool className="size-32 text-primary" />',
    '<CardDecorativeIcon className="opacity-20">\n                                <PenTool className="size-32 text-primary" />'
);

// Replace Secondary
content = content.replace(
    '<CardTitle className="text-sm font-bold text-foreground">English for IT</CardTitle>',
    '<CardTitle className="text-sm font-bold text-secondary">English for IT</CardTitle>'
).replace(
    '<CardDecorativeIcon className="opacity-30">\n                                <Languages className="size-32 text-secondary" />',
    '<CardDecorativeIcon className="opacity-20">\n                                <Languages className="size-32 text-secondary" />'
);

// Replace Info
content = content.replace(
    '<CardTitle className="text-sm font-bold text-foreground">App Design</CardTitle>',
    '<CardTitle className="text-sm font-bold text-info">App Design</CardTitle>'
).replace(
    '<CardDecorativeIcon className="opacity-30">\n                                <Layers className="size-32 text-info" />',
    '<CardDecorativeIcon className="opacity-20">\n                                <Layers className="size-32 text-info" />'
);

// Replace Warning
content = content.replace(
    '<CardTitle className="text-sm font-bold text-foreground">Design Management</CardTitle>',
    '<CardTitle className="text-sm font-bold text-warning">Design Management</CardTitle>'
).replace(
    '<CardDecorativeIcon className="opacity-30">\n                                <BookOpen className="size-32 text-warning" />',
    '<CardDecorativeIcon className="opacity-20">\n                                <BookOpen className="size-32 text-warning" />'
);

fs.writeFileSync('src/modules/uikit/components/card-showcase.tsx', content, 'utf8');
