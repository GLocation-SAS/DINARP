const fs = require('fs');

let content = fs.readFileSync('src/modules/uikit/components/logo-manager-card.tsx', 'utf8');

content = content.replace(
  '<a href={lightImg} download className="w-full dark:hidden">',
  '{lightImg && <a href={lightImg} download className="w-full dark:hidden">'
).replace(
  'Descargar SVG\n              </Button>\n            </a>\n            <a href={darkImg} download className="w-full hidden dark:block">',
  'Descargar SVG\n              </Button>\n            </a>}\n            {darkImg && <a href={darkImg} download className="w-full hidden dark:block">'
).replace(
  'Descargar SVG\n              </Button>\n            </a>\n\n          </div>',
  'Descargar SVG\n              </Button>\n            </a>}\n\n          </div>'
);

// We should also look out for `defaultLightImg` or `lightImg` being something that implies "no image".
// But in LogoManagerCard, the props passed are actual paths like "/logotipo.png" or "/favicon.ico". 
// Wait! Wait! Wait! Wait! Wait! The user says "y kos que todavia no hay quita el button descargar".
// "Y los que todavía no hay quita el botón descargar". 
// But "los que todavía no hay" are currently placeholder DIVs in `style-guide.tsx`, they are NOT `LogoManagerCard` components.
// Let me look at style-guide.tsx one more time.
