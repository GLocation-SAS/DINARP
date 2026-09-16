const fs = require('fs');
let content = fs.readFileSync('src/components/ui/file-upload.tsx', 'utf8');

// The remove button
// It currently has variant="secondary" and icon Trash2
content = content.replace(/variant="secondary"([\s\S]*?)<Trash2/g, 'variant="neutral"$1<Trash2');

// The main upload button
// It currently has variant="primary" and icon UploadCloud
content = content.replace(/variant="primary"([\s\S]*?)(<UploadCloud className="size-4 mr-2" \/>[\s\S]*?\{multiple \? "Seleccionar archivos\.\.\." : "Seleccionar archivo\.\.\."\})/g, 'variant="neutral"$1$2');

fs.writeFileSync('src/components/ui/file-upload.tsx', content, 'utf8');
