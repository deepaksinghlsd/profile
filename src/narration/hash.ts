/**
 * FNV-1a (32-bit) hash of a narration text. The generator stores it in the
 * audio manifest; the browser recomputes it to tell whether a pre-generated
 * file still matches the text on the page. Not cryptographic, and it does not
 * need to be: it only detects stale audio. Works without crypto.subtle, which
 * is missing on plain-http LAN previews.
 */
export function textHash(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}
