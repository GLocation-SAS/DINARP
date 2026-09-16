const fs = require('fs');

// 1. Remove from sidebar
let sidebar = fs.readFileSync('src/modules/uikit/components/uikit-sidebar.tsx', 'utf8');
const sidebarRegex = /\{\s*id: "risk-analytics-category",[\s\S]*?subItems: \[[\s\S]*?\]\s*\},/m;
sidebar = sidebar.replace(sidebarRegex, '');
fs.writeFileSync('src/modules/uikit/components/uikit-sidebar.tsx', sidebar, 'utf8');

// 2. Remove from views
let views = fs.readFileSync('src/modules/uikit/views/uikit-view.tsx', 'utf8');
views = views.replace(/import \{ RiskAnalyticsShowcase \} from "\.\.\/components\/risk-analytics-showcase";\n/, '');
views = views.replace(/\s*"risk-analytics-category": RiskAnalyticsShowcase,/, '');
fs.writeFileSync('src/modules/uikit/views/uikit-view.tsx', views, 'utf8');
