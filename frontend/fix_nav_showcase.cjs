const fs = require('fs');

let content = fs.readFileSync('src/modules/uikit/components/navigation-showcase.tsx', 'utf8');

// The navigation-showcase uses multiple iframes. Let's find them.
// Wait, we need to import GeoportalHeader, NotificationsMenu, UserMenu
const imports = `import { GeoportalHeader } from "@/components/layout/geoportal-header";
import { NotificationsMenu } from "@/components/shared/notifications-menu";
import { UserMenu } from "@/components/shared/user-menu";
`;

content = content.replace(
  'import { ShieldCheck, Info, UserCircle2 } from "lucide-react";',
  'import { ShieldCheck, Info, UserCircle2 } from "lucide-react";\n' + imports
);

// Header 
content = content.replace(
  /<iframe[\s\n]*src="\/header-preview\?theme=\$\{theme\}"[\s\S]*?\/>/g,
  '<div className="w-full h-full border-none bg-background pointer-events-auto rounded-xl relative z-10 flex flex-col justify-start">\n              <GeoportalHeader variant="full" />\n            </div>'
);

// Notifications 
content = content.replace(
  /<iframe[\s\n]*src="\/notifications-menu-preview\?theme=\$\{theme\}"[\s\S]*?\/>/g,
  '<div className="w-full h-[500px] border-none bg-background pointer-events-auto rounded-xl relative z-10 flex items-start justify-end p-8">\n              <NotificationsMenu isEmpty={false} />\n            </div>'
);

// User Menu
content = content.replace(
  /<iframe[\s\n]*src="\/user-menu-preview\?theme=\$\{theme\}"[\s\S]*?\/>/g,
  '<div className="w-full h-[400px] border-none bg-background pointer-events-auto rounded-xl relative z-10 flex items-start justify-end p-8">\n              <UserMenu />\n            </div>'
);

fs.writeFileSync('src/modules/uikit/components/navigation-showcase.tsx', content, 'utf8');

