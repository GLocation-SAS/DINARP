const fs = require('fs');
let content = fs.readFileSync('src/components/ui/file-input.tsx', 'utf8');

const oldBadges = /<div className="flex flex-wrap items-center justify-center gap-2 mt-4 z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-300">[\s\S]*?<\/div>/m;

const newBadges = `<div className="flex flex-wrap items-center justify-center gap-2 mt-4 z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
        <Badge tone="secondary" appearance="outline" size="sm">.jpeg</Badge>
        <Badge tone="primary" appearance="outline" size="sm">.png</Badge>
        <Badge tone="success" appearance="outline" size="sm">.csv</Badge>
        <Badge tone="danger" appearance="outline" size="sm">.pdf</Badge>
        <Badge tone="info" appearance="outline" size="sm">.mp4</Badge>
      </div>`;

content = content.replace(oldBadges, newBadges);
fs.writeFileSync('src/components/ui/file-input.tsx', content, 'utf8');
