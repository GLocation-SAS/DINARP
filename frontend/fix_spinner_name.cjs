const fs = require('fs');
let content = fs.readFileSync('src/modules/uikit/components/feedback-states-showcase.tsx', 'utf8');

content = content.replace(/GRiskSpinner/g, 'DINARPSpinner');
content = content.replace(/grisk-spinner/g, 'dinarp-spinner');

fs.writeFileSync('src/modules/uikit/components/feedback-states-showcase.tsx', content, 'utf8');
