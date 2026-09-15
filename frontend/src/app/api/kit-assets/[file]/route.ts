import { Readable } from 'node:stream';
import { kitAssetsBucket } from '@/lib/gcs';

const CONTENT_TYPES: Record<string, string> = {
  svg: 'image/svg+xml',
  png: 'image/png',
  ico: 'image/x-icon',
};

/**
 * Sirve los logos subidos vía el editor del kit (grisk-kit-assets) como
 * proxy — mismo patrón que /branding/[file] en geovisor-grisk-app. Cache
 * corto: el mismo nombre de archivo cambia de contenido cuando se reemplaza
 * un logo.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;

  const extension = file.split('.').pop()?.toLowerCase();
  const contentType = extension ? CONTENT_TYPES[extension] : undefined;
  if (!contentType) {
    return Response.json({ error: `Extensión no soportada: ${file}` }, { status: 400 });
  }

  try {
    let resolvedFile = kitAssetsBucket.file(file);
    let resolvedType = contentType;
    let [exists] = await resolvedFile.exists();

    // El upload borra las extensiones hermanas viejas (ver route.ts), así
    // que a lo sumo hay UNA extensión vigente por slot — pero el cliente
    // (LogoManagerCard) no sabe cuál sin preguntar. Si pide "horizontal.svg"
    // y lo último subido fue un .png, se cae a esa extensión hermana.
    if (!exists) {
      const base = file.slice(0, -(extension!.length + 1));
      for (const [altExt, altType] of Object.entries(CONTENT_TYPES)) {
        if (altExt === extension) continue;
        const altFile = kitAssetsBucket.file(`${base}.${altExt}`);
        const [altExists] = await altFile.exists();
        if (altExists) {
          resolvedFile = altFile;
          resolvedType = altType;
          exists = true;
          break;
        }
      }
    }

    if (!exists) {
      return Response.json({ error: `Recurso no encontrado: ${file}` }, { status: 404 });
    }

    const body = Readable.toWeb(resolvedFile.createReadStream()) as ReadableStream;
    return new Response(body, {
      headers: {
        'Content-Type': resolvedType,
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch (err) {
    console.error('[kit-assets] no se pudo leer el asset del bucket:', (err as Error).message);
    return Response.json({ error: `Recurso no disponible: ${file}` }, { status: 404 });
  }
}
