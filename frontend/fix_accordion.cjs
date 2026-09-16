const fs = require('fs');
let content = fs.readFileSync('src/components/ui/accordion.tsx', 'utf8');

const oldAccordionItem = /const AccordionItem = React\.forwardRef<[\s\S]*?>\(\(\{ className, \.\.\.props \}, ref\) => \([\s\S]*?<AccordionPrimitive\.Item[\s\S]*?ref=\{ref\}[\s\S]*?className=\{cn\([\s\S]*?"border-b border-border border-l-\[3px\] border-l-transparent transition-colors data-\[state=open\]:border-l-secondary data-\[state=open\]:bg-secondary\/5",[\s\S]*?className[\s\S]*?\)\}[\s\S]*?\{\.\.\.props\}[\s\S]*?\/>\n\)\)/m;

const newAccordionItem = `const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "border-b border-border/60 border-l-[3px] border-l-transparent transition-all duration-300 data-[state=open]:border-l-secondary data-[state=open]:bg-secondary/[0.03]",
      className
    )}
    {...props}
  />
))`;

content = content.replace(oldAccordionItem, newAccordionItem);

const oldAccordionTrigger = /const AccordionTrigger = React\.forwardRef<[\s\S]*?>\(\(\{ className, children, \.\.\.props \}, ref\) => \([\s\S]*?<AccordionPrimitive\.Header className="flex">[\s\S]*?<AccordionPrimitive\.Trigger[\s\S]*?ref=\{ref\}[\s\S]*?className=\{cn\([\s\S]*?"flex flex-1 items-center justify-between px-4 py-4 text-\[15px\] font-medium transition-all text-left text-foreground data-\[state=open\]:text-secondary hover:bg-muted\/30 \[\&\[data-state=open\]>div\]:bg-secondary \[\&\[data-state=open\]>div>svg\]:text-secondary-foreground \[\&\[data-state=open\]>div>svg\]:rotate-180",[\s\S]*?className[\s\S]*?\)\}[\s\S]*?\{\.\.\.props\}[\s\S]*?>[\s\S]*?\{children\}[\s\S]*?<div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted\/50 transition-colors duration-200 shrink-0 ml-4">[\s\S]*?<ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" \/>[\s\S]*?<\/div>[\s\S]*?<\/AccordionPrimitive\.Trigger>[\s\S]*?<\/AccordionPrimitive\.Header>\n\)\)/m;

const newAccordionTrigger = `const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between px-5 py-4 text-[15px] font-semibold transition-all text-left text-foreground data-[state=open]:text-secondary hover:bg-muted/30 [&[data-state=open]>div]:bg-secondary [&[data-state=open]>div]:border-secondary [&[data-state=open]>div>svg]:text-white [&[data-state=open]>div>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <div className="flex items-center justify-center size-7 rounded-full bg-background shadow-sm border border-border/60 transition-all duration-300 shrink-0 ml-4 group-hover:bg-muted/50">
        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-300" strokeWidth={2.5} />
      </div>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))`;

content = content.replace(oldAccordionTrigger, newAccordionTrigger);

const oldAccordionContent = /<div className=\{cn\("pb-4 pt-0 px-4 text-muted-foreground", className\)\}>\{children\}<\/div>/;
const newAccordionContent = `<div className={cn("pb-5 pt-0 px-5 text-muted-foreground/80 leading-relaxed text-[14px]", className)}>{children}</div>`;
content = content.replace(oldAccordionContent, newAccordionContent);


fs.writeFileSync('src/components/ui/accordion.tsx', content, 'utf8');
