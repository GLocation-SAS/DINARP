const fs = require('fs');
let content = fs.readFileSync('src/modules/uikit/components/style-guide.tsx', 'utf8');

const regex = /\{\/\* Card 3: Favicon \*\/\}([\s\S]*?)<\/div>/;

const newLogos = `{/* Card 3: Favicon */}
              <LogoManagerCard
                slot="favicon"
                title="Favicon"
                description="Versión simplificada del símbolo que identifica el sitio en la pestaña del navegador y en espacios digitales de tamaño muy pequeño."
                badge1="FAVICON"
                badge2="MÍNIMO"
                defaultLightImg="/favicon.ico"
                defaultDarkImg="/favicon.ico"
              />
              
              {/* Card 4: Placeholder Escudo Nacional */}
              <div className="flex flex-col rounded-3xl border border-dashed border-border/60 bg-surface/50 overflow-hidden shadow-sm group">
                <div className="h-48 w-full bg-muted/20 flex flex-col items-center justify-center p-6 text-center border-b border-dashed border-border/60">
                  <div className="size-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                    <ImageOff className="size-5 text-muted-foreground/50" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Recurso faltante</span>
                  <span className="text-xs text-muted-foreground/60 mt-1 max-w-[200px]">Este imagotipo aún no ha sido provisto.</span>
                </div>
                <div className="p-6 flex flex-col flex-1 bg-surface/50">
                  <div className="flex gap-2 mb-4">
                    <Badge tone="neutral" appearance="soft" size="sm" className="font-bold uppercase tracking-wider text-[10px] px-2.5 py-1 opacity-50">
                      ESCUDO
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-foreground/70 font-bold text-lg">Escudo Nacional / Institucional</h3>
                    <p className="text-muted-foreground/60 text-sm leading-relaxed">
                      Versión formal del escudo para documentos oficiales. Pendiente de cargar al repositorio de activos.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 5: Placeholder Sin Lema */}
              <div className="flex flex-col rounded-3xl border border-dashed border-border/60 bg-surface/50 overflow-hidden shadow-sm group">
                <div className="h-48 w-full bg-muted/20 flex flex-col items-center justify-center p-6 text-center border-b border-dashed border-border/60">
                  <div className="size-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                    <ImageOff className="size-5 text-muted-foreground/50" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Recurso faltante</span>
                  <span className="text-xs text-muted-foreground/60 mt-1 max-w-[200px]">La versión sin lema aún no está disponible.</span>
                </div>
                <div className="p-6 flex flex-col flex-1 bg-surface/50">
                  <div className="flex gap-2 mb-4">
                    <Badge tone="neutral" appearance="soft" size="sm" className="font-bold uppercase tracking-wider text-[10px] px-2.5 py-1 opacity-50">
                      SIN LEMA
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-foreground/70 font-bold text-lg">Logotipo sin lema</h3>
                    <p className="text-muted-foreground/60 text-sm leading-relaxed">
                      Variante limpia sin el texto inferior para usos reducidos. Pendiente de cargar al repositorio de activos.
                    </p>
                  </div>
                </div>
              </div>
            </div>`;

// make sure ImageOff is imported
if (!content.includes('ImageOff')) {
  content = content.replace('ImageIcon,', 'Image as ImageIcon, ImageOff,');
}

content = content.replace(/\{\/\* Card 3: Favicon \*\/\}[\s\S]*?<\/div>/, newLogos);

fs.writeFileSync('src/modules/uikit/components/style-guide.tsx', content, 'utf8');
