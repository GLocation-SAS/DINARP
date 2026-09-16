const fs = require('fs');
let content = fs.readFileSync('src/components/ui/file-upload.tsx', 'utf8');

// The main upload button
content = content.replace('variant="primary"', 'variant="neutral"');

// We also need to change the Trash2 button to neutral
// In FileUploadItem, there is a Trash2 button
content = content.replace(`                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="secondary"
                            size="icon"
                            onClick={onRemove}
                            className="size-8 text-muted-foreground"
                          >
                            <Trash2 className="size-4" />
                          </Button>`, `                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="neutral"
                            size="icon"
                            onClick={onRemove}
                            className="size-8 text-muted-foreground"
                          >
                            <Trash2 className="size-4" />
                          </Button>`);

fs.writeFileSync('src/components/ui/file-upload.tsx', content, 'utf8');
