const fs = require('fs');
let content = fs.readFileSync('src/modules/uikit/components/logo-manager-card.tsx', 'utf8');

// I will add `isMissing?: boolean;` to LogoManagerCardProps
// And if `isMissing` is true, I will render the placeholder block inside the LogoManagerCard instead of the image viewer, and omit the buttons.
// Wait, the easiest way is to just use the placeholder div where LogoManagerCard is used in style-guide for Favicon, or just make LogoManagerCard support a missing state. Let's make it support a missing state!

let newContent = content.replace(
  'allowedFormats?: string;\n}',
  'allowedFormats?: string;\n  isMissing?: boolean;\n}'
);

newContent = newContent.replace(
  'allowedFormats = "SVG o PNG",\n}: LogoManagerCardProps) {',
  'allowedFormats = "SVG o PNG",\n  isMissing = false,\n}: LogoManagerCardProps) {'
);

newContent = newContent.replace(
  '          <div className="h-48 w-full bg-muted/20 flex items-center justify-center p-6 text-center border-b border-dashed border-border/60 relative group-hover:bg-muted/30 transition-colors">\n',
  `          <div className="h-48 w-full bg-muted/20 flex flex-col items-center justify-center p-6 text-center border-b border-dashed border-border/60 relative group-hover:bg-muted/30 transition-colors">
            {isMissing ? (
              <>
                <div className="size-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                  <ImageOff className="size-5 text-muted-foreground/50" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Recurso faltante</span>
                <span className="text-xs text-muted-foreground/60 mt-1 max-w-[200px]">falta el recurso oficial del manual de marca</span>
              </>
            ) : (\n`
);

// We must close this `isMissing ? (...) : (` after the image tags.
// Let's find where it ends.
newContent = newContent.replace(
  '            <img\n              src={activeDarkImg}\n              alt={`${title} Dark`}\n              className={`hidden dark:block ${maxHeightClass} w-auto object-contain transition-transform group-hover:scale-105`}\n              onError={() => setDarkImg(defaultDarkImg)}\n            />\n          </div>',
  '            <img\n              src={activeDarkImg}\n              alt={`${title} Dark`}\n              className={`hidden dark:block ${maxHeightClass} w-auto object-contain transition-transform group-hover:scale-105`}\n              onError={() => setDarkImg(defaultDarkImg)}\n            />\n            )}\n          </div>'
);

// And we hide the download buttons when isMissing is true
newContent = newContent.replace(
  '<div className="mt-auto flex flex-col gap-2">',
  '<div className="mt-auto flex flex-col gap-2">\n            {!isMissing && ('
).replace(
  'Descargar SVG\n              </Button>\n            </a>}\n\n          </div>',
  'Descargar SVG\n              </Button>\n            </a>}\n            )}\n          </div>'
);


fs.writeFileSync('src/modules/uikit/components/logo-manager-card.tsx', newContent, 'utf8');
