const fs = require('fs');
let content = fs.readFileSync('src/modules/uikit/components/data-showcase.tsx', 'utf8');

// I accidentally deleted the whole import block with the fuzzy replacement logic. Let's fix it by regex instead.
content = content.replace(
  'Hash, Clock, Navigation, GraduationCap, AlertTriangle, Map, CheckCircle2, Info, XCircle, Zap',
  'Hash, Clock, Navigation, GraduationCap, AlertTriangle, Map, CheckCircle2, Info, XCircle, Zap, FileText'
);

fs.writeFileSync('src/modules/uikit/components/data-showcase.tsx', content, 'utf8');
