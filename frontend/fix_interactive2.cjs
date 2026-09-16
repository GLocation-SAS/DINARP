const fs = require('fs');

const content = fs.readFileSync('src/components/ui/data-display.tsx', 'utf8');

// Replace Badge rendering
let newContent = content.replace(
  '<Badge appearance="soft" tone={color === "default" || color === "purple" ? "neutral" : color} className="text-[10px] px-2 py-0.5 mb-2 shadow-none border-transparent font-semibold z-10">',
  '<Badge appearance="soft" tone={color === "default" || color === "purple" ? "neutral" : color} className={`text-[10px] px-2 py-0.5 mb-2 shadow-none border-transparent font-semibold z-10 bg-${color === "default" ? "surface" : color}/30 text-${color === "default" ? "foreground" : color}-700 dark:text-${color === "default" ? "foreground" : color}-200`}>'
);

// We should fix the bg-/30 to use a solid background class or something else, wait. If we use appearance="soft", it already adds background. Let's just use a hardcoded background or higher opacity.
// It might be easier to use `bg-${color}/20 text-${color}` inline if we use solid? No, let's just add `bg-${color}/20` in the classname which tailwind will merge.

newContent = content.replace(
  '<Badge appearance="soft" tone={color === "default" || color === "purple" ? "neutral" : color} className="text-[10px] px-2 py-0.5 mb-2 shadow-none border-transparent font-semibold z-10">',
  '<Badge appearance="soft" tone={color === "default" || color === "purple" ? "neutral" : color} className={`text-[10px] px-2 py-0.5 mb-2 shadow-none border-transparent font-semibold z-10 ${color !== "default" ? "bg-" + color + "/20 text-" + color : "bg-muted-foreground/20 text-foreground"}`}>'
);

// Make the icon bigger and more bottom-right
newContent = newContent.replace(
  '<div className={cn("absolute -bottom-4 -right-4 size-32 pointer-events-none transition-all duration-500 z-0", iconColorClass)}>',
  '<div className={cn("absolute -bottom-8 -right-8 size-40 pointer-events-none transition-all duration-500 z-0", iconColorClass)}>'
);

fs.writeFileSync('src/components/ui/data-display.tsx', newContent, 'utf8');
