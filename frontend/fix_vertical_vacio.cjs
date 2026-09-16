const fs = require('fs');
let content = fs.readFileSync('src/modules/uikit/components/style-guide.tsx', 'utf8');

// The user already has "Escudo Nacional" and "Sin Lema" as placeholders with the "Recurso faltante" text.
// They explicitly mentioned: "pon en los logito'pos recurso faltante pq no hay vertical vacion ni escudo nacional..."
// Oh wait, they specifically said "vertical vacion" (vertical vacio). I see they have:
// Card 2: Vertical (already exists with Logo-vertical.svg)
// Let me change "Sin lema" to "Vertical vacío" or just ensure the titles match what they asked for.
// Wait, I should make sure the placeholder says exactly "vertical vacio" if that's what they mean.

// Let's replace "Logotipo sin lema" card with "Vertical vacío"
content = content.replace(/SIN LEMA/g, 'VERTICAL VACÍO');
content = content.replace(/Logotipo sin lema/g, 'Logotipo vertical vacío');
content = content.replace(/La versión sin lema aún no está disponible\./g, 'La versión vertical vacía aún no está disponible.');

fs.writeFileSync('src/modules/uikit/components/style-guide.tsx', content, 'utf8');
