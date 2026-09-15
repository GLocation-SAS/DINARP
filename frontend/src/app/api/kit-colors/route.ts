import { kitAssetsBucket } from '@/lib/gcs';

// Nombre visible en style-guide.tsx -> variable CSS real que lee el
// geovisor (ver SEMANTIC_COLORS/GOVERNMENT_COLORS ahí — .variable/.token
// sin el "--"). Whitelist: solo estos nombres se persisten: ediciones de
// tono individual (ej. "Primary-300") se ignoran a propósito, el geovisor
// no consume esas variables de primitivos.
const COLOR_NAME_TO_VARIABLE: Record<string, string> = {
  Primary: 'primary',
  Secondary: 'secondary',
  Success: 'success',
  Warning: 'warning',
  Danger: 'danger',
  Info: 'info',
  Surface: 'surface',
  Muted: 'muted',
  Accent: 'accent',
  'Government Accent 1': 'government-accent-1',
  'Government Primary': 'government-primary',
  'Government Accent 2': 'government-accent-2',
  'Government Accent 3': 'government-accent-3',
  'Government Secondary': 'government-secondary',
  'Government Info': 'government-info',
};

const TOKENS_OBJECT = 'design-tokens.json';
const HEX_RE = /^#[0-9a-fA-F]{6}$/;

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

function emptyTokens(): DesignTokens {
  const empty: FontToken = { family: 'Nunito', weights: [], files: {} };
  return { colors: {}, fonts: { heading: { ...empty }, sans: { ...empty, family: 'Montserrat' } }, radius: '0.75rem', shadows: {}, logos: [] };
}

/**
 * Al confirmar un cambio de color en style-guide.tsx (Government Primary,
 * Base/Semánticos, o el tono 500 de una escala) — persiste a
 * design-tokens.json en grisk-kit-assets. Recibe el mismo objeto
 * `updates` (nombre visible -> hex) que ya calcula el diálogo de
 * confirmación para la sincronización Government<->Semántico<->Escala; acá
 * solo se traduce cada nombre a su variable CSS real vía la whitelist y se
 * ignoran las claves que no calcen (ediciones de tono individual).
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { updates?: Record<string, string> } | null;
  const updates = body?.updates;
  if (!updates || typeof updates !== 'object') {
    return Response.json({ error: 'Solicitud inválida: falta updates.' }, { status: 400 });
  }

  const resolved: Record<string, string> = {};
  for (const [name, hex] of Object.entries(updates)) {
    const variable = COLOR_NAME_TO_VARIABLE[name];
    if (!variable || typeof hex !== 'string' || !HEX_RE.test(hex)) continue;
    resolved[variable] = hex;
  }

  if (Object.keys(resolved).length === 0) {
    return Response.json({ error: 'Ningún color reconocido en updates.' }, { status: 400 });
  }

  try {
    let tokens: DesignTokens;
    try {
      const [buffer] = await kitAssetsBucket.file(TOKENS_OBJECT).download();
      tokens = JSON.parse(buffer.toString('utf8')) as DesignTokens;
    } catch {
      tokens = emptyTokens();
    }

    tokens.colors = { ...tokens.colors, ...resolved };
    await kitAssetsBucket.file(TOKENS_OBJECT).save(JSON.stringify(tokens, null, 2), { contentType: 'application/json' });
  } catch (err) {
    console.error('[kit-colors] error al guardar en el bucket:', (err as Error).message);
    return Response.json({ error: 'No se pudo guardar el color en el bucket.' }, { status: 502 });
  }

  return Response.json({ ok: true, updated: resolved });
}
