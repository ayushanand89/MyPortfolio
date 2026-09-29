/**
 * Brand fonts for the generated share images (next/og can't use the site's
 * woff2 next/font files). Asks Google Fonts for a static TTF instance, subset
 * to just the characters on the card. Returns null on any failure so the
 * image still renders (in the default face) when offline.
 */
export async function googleFont(family: string, text: string) {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!src) return null;
    const res = await fetch(src);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight?: 400 | 600 | 900;
  style?: "normal" | "italic";
};

/**
 * Archivo (widest cut, black) for display type, Instrument Serif italic for
 * the aside, and Archivo semibold for small labels. The label face goes
 * first: next/og uses the first font for any text without a family, so every
 * glyph on the card must be in it (pass all label text as `text`).
 */
export async function brandFonts(display: string, serif: string, text: string) {
  const [label, archivo, instrument] = await Promise.all([
    googleFont("Archivo:wdth,wght@112,600", text),
    googleFont("Archivo:wdth,wght@125,900", display),
    googleFont("Instrument+Serif:ital@1", serif),
  ]);
  const fonts: OgFont[] = [];
  if (label) fonts.push({ name: "Archivo Text", data: label, weight: 600, style: "normal" });
  if (archivo) fonts.push({ name: "Archivo", data: archivo, weight: 900, style: "normal" });
  if (instrument) fonts.push({ name: "Instrument Serif", data: instrument, weight: 400, style: "italic" });
  // Without the label face the defaults are fine, but a display-only font
  // list would make it the fallback for labels - drop fonts in that case.
  if (!label) return { fonts: [], hasDisplay: false, hasSerif: false };
  return { fonts, hasDisplay: !!archivo, hasSerif: !!instrument };
}
