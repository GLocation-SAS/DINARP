import { kitAssetsBucket } from '@/lib/gcs';

// Slots válidos — deben calzar con los 4 LogoManagerCard de style-guide.tsx
// (foundations-logos). Whitelist explícita para no permitir subir a
// nombres de objeto arbitrarios en el bucket.
const BASE_SLOTS = ['horizontal', 'vertical', 'escudo', 'favicon'];
const VALID_SLOTS = new Set(
  BASE_SLOTS.flatMap(s => [s, `${s}-light`, `${s}-dark`, `Escudo light`])
);

const CONTENT_TYPES: Record<string, string> = {
  svg: 'image/svg+xml',
  png: 'image/png',
  ico: 'image/x-icon',
};

function extensionFor(file: File): string | null {
  if (file.type === 'image/svg+xml') return 'svg';
  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/x-icon' || file.type === 'image/vnd.microsoft.icon') return 'ico';
  // Algunos navegadores no setean el MIME de .ico — se cae al nombre del archivo.
  const byName = file.name.split('.').pop()?.toLowerCase();
  return byName && byName in CONTENT_TYPES ? byName : null;
}

/**
 * Sube un logo editado por LogoManagerCard al bucket de borrador del kit
 * (grisk-kit-assets) — NUNCA a grisk-design-tokens (ese lo lee el
 * geovisor en producción, visible al cliente; este endpoint no lo toca).
 *
 * Sin control de acceso por ahora (decisión explícita del usuario, sitio
 * público sin login todavía) — pendiente cuando exista autenticación real.
 */
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  const slot = form?.get('slot');

  if (!(file instanceof File) || typeof slot !== 'string' || !VALID_SLOTS.has(slot)) {
    return Response.json({ error: 'Solicitud inválida: falta file o slot no reconocido.' }, { status: 400 });
  }

  const ext = extensionFor(file);
  if (!ext) {
    return Response.json({ error: 'Formato no soportado (solo SVG, PNG o ICO).' }, { status: 400 });
  }

  const objectName = `${slot}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const allExts = Object.keys(CONTENT_TYPES);

  /**
   * Borra las variantes con OTRA extensión del mismo nombre base (ej. al
   * subir escudo.png, borra escudo.svg si existía). Sin esto, un logo
   * subido antes en un formato distinto queda como archivo huérfano — y
   * como quien lo lee pide una extensión fija (ver Header.tsx), ese
   * huérfano gana y el reemplazo nunca se ve reflejado ahí.
   */
  async function removeStaleSiblings(baseName: string, keepExt: string) {
    await Promise.all(
      allExts
        .filter((e) => e !== keepExt)
        .map((e) => kitAssetsBucket.file(`${baseName}.${e}`).delete({ ignoreNotFound: true })),
    );
  }

  try {
    await kitAssetsBucket.file(objectName).save(buffer, { contentType: CONTENT_TYPES[ext] });
    await removeStaleSiblings(slot, ext);

    // El escudo, además de su propio nombre de slot, se guarda TAMBIÉN
    // como "Escudo light.{ext}" — es el nombre literal que
    // geovisor-grisk-app/src/shared/layout/Header.tsx pide vía
    // /branding/Escudo%20light.svg. Así el geovisor de preview (apuntado a
    // este bucket) refleja el cambio sin tocar ni una línea de ese repo.
    if (slot === 'escudo') {
      await kitAssetsBucket.file(`Escudo light.${ext}`).save(buffer, { contentType: CONTENT_TYPES[ext] });
      await removeStaleSiblings('Escudo light', ext);
    }
  } catch (err) {
    console.error('[kit-assets] error al subir al bucket:', (err as Error).message);
    return Response.json({ error: 'No se pudo guardar el archivo en el bucket.' }, { status: 502 });
  }

  return Response.json({ url: `/api/kit-assets/${objectName}?t=${Date.now()}` });
}
