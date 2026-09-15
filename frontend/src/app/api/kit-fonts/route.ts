import { kitAssetsBucket } from '@/lib/gcs';
import { downloadGoogleFont } from '@/lib/google-fonts';

// Debe calzar con la lista de la Combobox en style-guide.tsx (Sistema
// Tipográfico) — whitelist para no permitir pedir una familia arbitraria.
const VALID_FAMILIES = new Set(['Nunito', 'Montserrat', 'Roboto', 'Inter', 'Open Sans', 'Poppins', 'Lato', 'Oswald']);

// id de la Combobox -> campo real que lee geovisor-grisk-app/src/shared/lib/design-tokens.ts.
const ROLE_TO_FIELD = { heading: 'heading', body: 'sans' } as const;

const TOKENS_OBJECT = 'design-tokens.json';

interface FontToken {
  family: string;
  weights: number[];
  files: Record<string, string>;
}

interface DesignTokens {
  colors: Record<string, string>;
  fonts: { heading: FontToken; sans: FontToken };
  radius: string;
  shadows: Record<string, string>;
  logos: string[];
}

// Base usada solo si todavía no existe ningún design-tokens.json en el
// bucket — deja colors/shadows/logos vacíos a propósito (el geovisor los
// trata como "sin override" y sigue usando sus valores hardcodeados; este
// endpoint solo toca tipografía, no debe inventar colores).
function emptyTokens(): DesignTokens {
  const empty: FontToken = { family: 'Nunito', weights: [], files: {} };
  return { colors: {}, fonts: { heading: { ...empty }, sans: { ...empty, family: 'Montserrat' } }, radius: '0.75rem', shadows: {}, logos: [] };
}

async function readCurrentTokens(): Promise<DesignTokens> {
  try {
    const [buffer] = await kitAssetsBucket.file(TOKENS_OBJECT).download();
    return JSON.parse(buffer.toString('utf8')) as DesignTokens;
  } catch {
    return emptyTokens();
  }
}

/**
 * Al confirmar un cambio de tipografía en style-guide.tsx: descarga los
 * .woff2 reales de la familia elegida, los sube a grisk-kit-assets, y
 * actualiza design-tokens.json en ese bucket — el mismo archivo/esquema
 * que geovisor-grisk-app ya sabe leer (ver shared/lib/design-tokens.ts),
 * así que el geovisor de preview lo refleja sin cambios de código ahí.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { role?: string; family?: string } | null;
  const role = body?.role;
  const family = body?.family;

  if ((role !== 'heading' && role !== 'body') || typeof family !== 'string' || !VALID_FAMILIES.has(family)) {
    return Response.json({ error: 'Solicitud inválida: role debe ser heading/body y family debe ser una tipografía soportada.' }, { status: 400 });
  }

  let fontFiles;
  try {
    fontFiles = await downloadGoogleFont(family);
  } catch (err) {
    console.error('[kit-fonts] error al descargar de Google Fonts:', (err as Error).message);
    return Response.json({ error: `No se pudo descargar "${family}" de Google Fonts.` }, { status: 502 });
  }

  try {
    await Promise.all(
      fontFiles.map((f) => kitAssetsBucket.file(f.filename).save(f.buffer, { contentType: 'font/woff2' })),
    );

    const tokens = await readCurrentTokens();
    const field = ROLE_TO_FIELD[role];
    tokens.fonts[field] = {
      family,
      weights: fontFiles.map((f) => f.weight),
      files: Object.fromEntries(fontFiles.map((f) => [String(f.weight), f.filename])),
    };

    await kitAssetsBucket.file(TOKENS_OBJECT).save(JSON.stringify(tokens, null, 2), { contentType: 'application/json' });
  } catch (err) {
    console.error('[kit-fonts] error al guardar en el bucket:', (err as Error).message);
    return Response.json({ error: 'No se pudo guardar la tipografía en el bucket.' }, { status: 502 });
  }

  return Response.json({ ok: true, family, weights: fontFiles.map((f) => f.weight) });
}
