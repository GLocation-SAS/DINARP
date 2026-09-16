const fs = require('fs');
let content = fs.readFileSync('src/modules/uikit/components/feedback-states-showcase.tsx', 'utf8');

content = content.replace(/action=\{<Button[^>]*>.*?<\/Button>\}/g, '');
content = content.replace(/<Alert variant="warning" icon=\{<AlertTriangle className="h-4 w-4" \/>\} title="Advertencia" >/g, '<Alert variant="warning" icon={<AlertTriangle className="h-4 w-4" />} title="Advertencia">');


fs.writeFileSync('src/modules/uikit/components/feedback-states-showcase.tsx', content, 'utf8');
