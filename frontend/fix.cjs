const fs = require('fs');

let content1 = fs.readFileSync('src/modules/uikit/components/feedback-states-showcase.tsx', 'utf8');

// Alerts fixes
content1 = content1.replace(
  /<Alert variant="warning" icon=\{<AlertTriangle className="h-4 w-4" \/>\} title="Advertencia" action=\{<Button variant="warning" size="sm">Ver detalles<\/Button>\} onClose=\{\(\) => \{ \}\}>\s*Existen 3 zonas con alertas preventivas que requieren atención\.\s*<\/Alert>/g,
  '<Alert variant="warning" icon={<AlertTriangle className="h-6 w-6" />} title="¡Advertencia!" action="Renovar ahora">\n              Su cuenta está a punto de expirar. Por favor renueve su suscripción.\n            </Alert>'
);

content1 = content1.replace(
  /<Alert icon=\{<Bell className="h-4 w-4" \/>\}>\s*Mensaje neutral por defecto\.\s*<\/Alert>/g,
  '<Alert icon={<Info className="h-6 w-6" />} title="¡Atención!" action="Ignorar" onClose={() => {}}>\n              Todo parece estar en orden con sus configuraciones.\n            </Alert>'
);

content1 = content1.replace(
  /<Alert variant="success" icon=\{<CheckCircle2 className="h-4 w-4" \/>\} title="Guardado exitoso">\s*El reporte de incidente se ha registrado correctamente en el sistema\.\s*<\/Alert>/g,
  '<Alert variant="success" icon={<CheckCircle2 className="h-6 w-6" />} title="¡Éxito!" action="Cerrar">\n              Sus cambios han sido guardados exitosamente.\n            </Alert>'
);

content1 = content1.replace(
  /<Alert variant="danger" icon=\{<XCircle className="h-4 w-4" \/>\} title="Error de conexión">\s*No se pudo conectar con el servidor geográfico\. Intenta de nuevo más tarde\.\s*<\/Alert>/g,
  '<Alert variant="danger" icon={<XCircle className="h-6 w-6" />} title="¡Error!" action="Reintentar">\n              Hubo un problema procesando su solicitud.\n            </Alert>'
);

content1 = content1.replace(
  /<Alert variant="info" icon=\{<Info className="h-4 w-4" \/>\} title="Información">\s*Las capas satelitales fueron actualizadas hoy a las 08:00 AM\.\s*<\/Alert>/g,
  '<Alert variant="info" icon={<Info className="h-6 w-6" />} title="37 Nuevas Reseñas">\n              Se han encontrado nuevas reseñas en su feed.\n            </Alert>'
);
fs.writeFileSync('src/modules/uikit/components/feedback-states-showcase.tsx', content1, 'utf8');

let content2 = fs.readFileSync('src/modules/uikit/components/toast-showcase.tsx', 'utf8');

content2 = content2.replace(
  /toast\("Proceso en segundo plano", \{\s*description: "La sincronización se está llevando a cabo\.",/g,
  'toast("La sincronización se está llevando a cabo.", {'
);

content2 = content2.replace(
  /toast\.success\("Operación exitosa", \{\s*description: "Los datos se han guardado correctamente en el sistema\."(?:.*)\}\)/g,
  'toast.success("Los datos se han guardado correctamente en el sistema.")'
);

content2 = content2.replace(
  /toast\.info\("Información del sistema", \{\s*description: "Hay una nueva actualización disponible para el módulo de mapas\."(?:.*)\}\)/g,
  'toast.info("Hay una nueva actualización disponible para el módulo de mapas.")'
);

content2 = content2.replace(
  /toast\.warning\("Advertencia de seguridad", \{\s*description: "Tu sesión expirará en 5 minutos por inactividad\."(?:.*)\}\)/g,
  'toast.warning("Tu sesión expirará en 5 minutos por inactividad.")'
);

content2 = content2.replace(
  /toast\.error\("Error de conexión", \{\s*description: "No se pudo establecer conexión con el servidor\. Reintente más tarde\."(?:.*)\}\)/g,
  'toast.error("No se pudo establecer conexión con el servidor. Reintente más tarde.")'
);

content2 = content2.replace(
  /toast\("Usuario eliminado", \{\s*description: "El usuario ha sido eliminado del sistema\.",/g,
  'toast("El usuario ha sido eliminado del sistema.", {'
);

content2 = content2.replace(
  /toast\("Mensaje personalizado", \{\s*description: "Este es un toast con una configuración personalizada de duración\.",/g,
  'toast("Este es un toast con una configuración personalizada de duración.", {'
);

content2 = content2.replace(
  /<div className="flex items-center justify-center shrink-0 size-10 rounded-lg bg-primary text-white shadow-sm">\s*<BellIcon className="size-5 stroke-\[2px\]" \/>\s*<\/div>/g,
  '<div className="flex items-center justify-center shrink-0"><BellIcon className="size-8 text-card fill-primary" /></div>'
);

content2 = content2.replace(
  /<div className="flex items-center justify-center shrink-0 size-10 rounded-lg bg-primary text-white shadow-sm">\s*<TimerIcon className="size-5 stroke-\[2px\]" \/>\s*<\/div>/g,
  '<div className="flex items-center justify-center shrink-0"><TimerIcon className="size-8 text-card fill-primary" /></div>'
);

fs.writeFileSync('src/modules/uikit/components/toast-showcase.tsx', content2, 'utf8');

