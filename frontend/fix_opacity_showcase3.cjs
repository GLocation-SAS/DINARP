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
                  {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((opacity) => {
                    const isDark = opacity > 50;
                    return (
                      <Badge 
                        key={'opacity-'+t+'-'+opacity}
                        tone={t}
                        appearance="soft"
                        className={\`bg-\${t}/\${opacity} \${isDark ? 'text-white dark:text-black shadow-sm' : ''} border-transparent\`}
                      >
                        {opacity}%
                      </Badge>
                    );
                  })}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
`;

content = content.replace('        {/* Ejemplos de uso */}', opacitySection + '        {/* Ejemplos de uso */}');

fs.writeFileSync('src/modules/uikit/components/badge-showcase.tsx', content, 'utf8');
