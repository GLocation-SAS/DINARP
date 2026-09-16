const fs = require('fs');
let content = fs.readFileSync('src/modules/uikit/components/toast-showcase.tsx', 'utf8');

content = content.replace(
  /<div className="flex items-center justify-center shrink-0 size-10 rounded-lg bg-primary text-white shadow-sm">\s*<BellIcon className="size-5 stroke-\[2px\]" \/>\s*<\/div>/g,
  '<div className="flex items-center justify-center shrink-0"><BellIcon className="size-8 text-card fill-primary" /></div>'
);

content = content.replace(
  /<div className="flex items-center justify-center shrink-0 size-10 rounded-lg bg-primary text-white shadow-sm">\s*<TimerIcon className="size-5 stroke-\[2px\]" \/>\s*<\/div>/g,
  '<div className="flex items-center justify-center shrink-0"><TimerIcon className="size-8 text-card fill-primary" /></div>'
);

// We had lost the "no title" from toast showcase so let's re-do them
content = content.replace(
  /toast\("Proceso en segundo plano", \{\s*description: "La sincronización se está llevando a cabo\.",/g,
  'toast("La sincronización se está llevando a cabo.", {'
);

content = content.replace(
  /toast\.success\("Operación exitosa", \{\s*description: "Los datos se han guardado correctamente en el sistema\."(?:.*)\}\)/g,
  'toast.success("Los datos se han guardado correctamente en el sistema.")'
);

content = content.replace(
  /toast\.info\("Información del sistema", \{\s*description: "Hay una nueva actualización disponible para el módulo de mapas\."(?:.*)\}\)/g,
  'toast.info("Hay una nueva actualización disponible para el módulo de mapas.")'
);

content = content.replace(
  /toast\.warning\("Advertencia de seguridad", \{\s*description: "Tu sesión expirará en 5 minutos por inactividad\."(?:.*)\}\)/g,
  'toast.warning("Tu sesión expirará en 5 minutos por inactividad.")'
);

content = content.replace(
  /toast\.error\("Error de conexión", \{\s*description: "No se pudo establecer conexión con el servidor\. Reintente más tarde\."(?:.*)\}\)/g,
  'toast.error("No se pudo establecer conexión con el servidor. Reintente más tarde.")'
);

content = content.replace(
  /toast\("Usuario eliminado", \{\s*description: "El usuario ha sido eliminado del sistema\.",/g,
  'toast("El usuario ha sido eliminado del sistema.", {'
);

content = content.replace(
  /toast\("Mensaje personalizado", \{\s*description: "Este es un toast con una configuración personalizada de duración\.",/g,
  'toast("Este es un toast con una configuración personalizada de duración.", {'
);

fs.writeFileSync('src/modules/uikit/components/toast-showcase.tsx', content, 'utf8');
