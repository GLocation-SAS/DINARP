const fs = require('fs');
let content = fs.readFileSync('src/modules/uikit/components/forms-filters-showcase.tsx', 'utf8');

const regex = /\{\/\* FILTER BAR Y APPLIED FILTERS \*\/\}\s*<SubSection\s*icon=\{Filter\} id="filter-bar"\s*registerSection=\{registerSection\}\s*title="Barra de Filtros y Filtros Aplicados"\s*description="Patrón reutilizable para listados, que combina búsquedas, selectores y muestra los filtros activos\."\s*>\s*<div className="flex flex-col gap-4 border border-border p-4 rounded-xl bg-surface">[\s\S]*?<\/SubSection>/g;

const replacement = `{/* FILTER BAR Y APPLIED FILTERS */}
        <SubSection
          icon={Filter} id="filter-bar"
          registerSection={registerSection}
          title="Barra de Filtros y Filtros Aplicados"
          description="Patrón reutilizable para listados, que combina búsquedas, selectores y muestra los filtros activos."
        >
          <div className="flex flex-col gap-4 border border-border/40 p-4 sm:p-5 rounded-2xl bg-surface shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="w-full sm:w-72">
                <Search placeholder="Buscar incidentes, folios o usuarios..." className="h-10 bg-background" />
              </div>
              <Button variant="outline" className="h-10 border-dashed hover:border-solid hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all">
                <Filter className="mr-2 h-4 w-4" /> 
                Filtros
                <Badge tone="primary" appearance="soft" className="ml-2 rounded-full w-5 h-5 p-0 justify-center text-[10px]">3</Badge>
              </Button>
              <div className="flex-1" />
              <Button variant="ghost" className="h-10 text-muted-foreground hover:text-foreground">
                Limpiar filtros
              </Button>
            </div>
  
            {/* Applied Filters */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/40">
              <span className="text-[13px] font-semibold text-muted-foreground mr-1">Filtros activos:</span>
              <Badge tone="success" appearance="soft" className="pl-3 pr-1 py-1 rounded-full text-[12px] h-7 gap-1 font-medium">
                Estado: Activo
                <button type="button" className="p-1 rounded-full hover:bg-success/20 text-success transition-colors cursor-pointer"><X className="size-3" /></button>
              </Badge>
              <Badge tone="info" appearance="soft" className="pl-3 pr-1 py-1 rounded-full text-[12px] h-7 gap-1 font-medium">
                Zona: Norte
                <button type="button" className="p-1 rounded-full hover:bg-info/20 text-info transition-colors cursor-pointer"><X className="size-3" /></button>
              </Badge>
              <Badge tone="neutral" appearance="soft" className="pl-3 pr-1 py-1 rounded-full text-[12px] h-7 gap-1 font-medium">
                Últimos 30 días
                <button type="button" className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-muted-foreground transition-colors cursor-pointer"><X className="size-3" /></button>
              </Badge>
            </div>
          </div>
        </SubSection>`;

content = content.replace(regex, replacement);

// Also need to make sure 'X' is imported if it isn't. Let's check imports.
if (!content.includes('X,')) {
    content = content.replace('Filter, ', 'Filter, X, ');
}

fs.writeFileSync('src/modules/uikit/components/forms-filters-showcase.tsx', content, 'utf8');
