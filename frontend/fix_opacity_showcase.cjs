const fs = require('fs');
let content = fs.readFileSync('src/modules/uikit/components/badge-showcase.tsx', 'utf8');

const opacitySection = `
        {/* Glassmorphism / Opacity Scales */}
        <div className="space-y-4 pt-6 border-t border-border/50">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Variantes de opacidad (Glassmorphism)</h3>
          </div>
          <p className="text-xs text-muted-foreground italic -mt-2 mb-4">Visualización de escalas desde 10% hasta 90% para jerarquías sutiles.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-y-6 items-center">
            {tones.map((t) => (
              <React.Fragment key={'opacity-row-'+t}>
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t === "danger" ? "Error" : t}</div>
                <div className="flex flex-wrap gap-4">
                  {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((opacity) => (
                    <div 
                      key={'opacity-'+t+'-'+opacity}
                      className={\`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-bold border border-transparent bg-\${t}/\${opacity} text-\${t} \${opacity > 40 ? 'text-\${t}-800 dark:text-\${t}-100' : ''}\`}
                    >
                      {opacity}%
                    </div>
                  ))}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
`;

// Insert it right before the Icons section or at the end.
content = content.replace('        {/* With Icons */}', opacitySection + '\n        {/* With Icons */}');

fs.writeFileSync('src/modules/uikit/components/badge-showcase.tsx', content, 'utf8');
