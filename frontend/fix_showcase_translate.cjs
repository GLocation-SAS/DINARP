const fs = require('fs');
let content = fs.readFileSync('src/modules/uikit/components/feedback-states-showcase.tsx', 'utf8');

// The showcase originally had English alerts. We must translate them, and remove 'action' property.
content = content.replace(
  /<Alert variant="info" icon=\{<Info className="h-5 w-5" \/>\} title="Heads up!"[^>]*>\s*Everything seems to be in order\.\s*<\/Alert>/g,
  '<Alert variant="info" icon={<Info className="h-5 w-5" />} title="¡Atención!" onClose={() => {}}>\n              Todo parece estar en orden.\n            </Alert>'
);
content = content.replace(
  /<Alert variant="success" icon=\{<CheckCircle2 className="h-5 w-5" \/>\} title="Success!"[^>]*>\s*Your changes have been saved successfully!\s*<\/Alert>/g,
  '<Alert variant="success" icon={<CheckCircle2 className="h-5 w-5" />} title="¡Éxito!" onClose={() => {}}>\n              Tus cambios han sido guardados exitosamente.\n            </Alert>'
);
content = content.replace(
  /<Alert variant="warning" icon=\{<AlertTriangle className="h-5 w-5" \/>\} title="Warning!"[^>]*>\s*Your account is about to expire\. Please renew your subscription\.\s*<\/Alert>/g,
  '<Alert variant="warning" icon={<AlertTriangle className="h-5 w-5" />} title="¡Advertencia!" onClose={() => {}}>\n              Tu cuenta está a punto de expirar. Por favor renueva tu suscripción.\n            </Alert>'
);
content = content.replace(
  /<Alert variant="danger" icon=\{<XCircle className="h-5 w-5" \/>\} title="Error!"[^>]*>\s*There was a problem processing your request!\s*<\/Alert>/g,
  '<Alert variant="danger" icon={<XCircle className="h-5 w-5" />} title="¡Error!" onClose={() => {}}>\n              ¡Hubo un problema procesando tu solicitud!\n            </Alert>'
);

// If it had the older alerts, let's just make sure they are correct
content = content.replace(
  /<Alert variant="info" icon=\{<Info className="h-6 w-6" \/>\} title="37 Nuevas Reseñas">\s*Se han encontrado nuevas reseñas en su feed\.\s*<\/Alert>/g,
  '<Alert variant="info" icon={<Info className="h-5 w-5" />} title="¡Atención!" onClose={() => {}}>\n              Todo parece estar en orden.\n            </Alert>'
);

content = content.replace(
  /<Alert variant="success" icon=\{<CheckCircle2 className="h-6 w-6" \/>\} title="¡Éxito!">\s*Sus cambios han sido guardados exitosamente\.\s*<\/Alert>/g,
  '<Alert variant="success" icon={<CheckCircle2 className="h-5 w-5" />} title="¡Éxito!" onClose={() => {}}>\n              Tus cambios han sido guardados exitosamente.\n            </Alert>'
);

content = content.replace(
  /<Alert variant="danger" icon=\{<XCircle className="h-6 w-6" \/>\} title="¡Error!">\s*Hubo un problema procesando su solicitud\.\s*<\/Alert>/g,
  '<Alert variant="danger" icon={<XCircle className="h-5 w-5" />} title="¡Error!" onClose={() => {}}>\n              ¡Hubo un problema procesando tu solicitud!\n            </Alert>'
);

content = content.replace(
  /<Alert variant="warning" icon=\{<AlertTriangle className="h-6 w-6" \/>\} title="¡Advertencia!">\s*Su cuenta está a punto de expirar\. Por favor renueve su suscripción\.\s*<\/Alert>/g,
  '<Alert variant="warning" icon={<AlertTriangle className="h-5 w-5" />} title="¡Advertencia!" onClose={() => {}}>\n              Tu cuenta está a punto de expirar. Por favor renueva tu suscripción.\n            </Alert>'
);

content = content.replace(
  /<Alert icon=\{<Info className="h-6 w-6" \/>\} title="¡Atención!">\s*Todo parece estar en orden con sus configuraciones\.\s*<\/Alert>/g,
  ''
);

fs.writeFileSync('src/modules/uikit/components/feedback-states-showcase.tsx', content, 'utf8');
