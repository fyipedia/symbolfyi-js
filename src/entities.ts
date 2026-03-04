/**
 * HTML named entity mappings — 47 commonly used entities.
 *
 * Maps Unicode codepoint (number) to entity name (without `&` and `;`).
 *
 * @see https://symbolfyi.com
 */

/** Codepoint to entity name (e.g. `0x2192 -> "rarr"`). */
export const HTML_ENTITIES: Record<number, string> = {
  0x0022: "quot",
  0x0026: "amp",
  0x003c: "lt",
  0x003e: "gt",
  0x00a3: "pound",
  0x00a5: "yen",
  0x00a9: "copy",
  0x00ae: "reg",
  0x00b0: "deg",
  0x00b1: "plusmn",
  0x00d7: "times",
  0x00f7: "divide",
  0x2122: "trade",
  0x20ac: "euro",
  0x2190: "larr",
  0x2191: "uarr",
  0x2192: "rarr",
  0x2193: "darr",
  0x2194: "harr",
  0x21d0: "lArr",
  0x21d2: "rArr",
  0x21d4: "hArr",
  0x2200: "forall",
  0x2202: "part",
  0x2203: "exist",
  0x2205: "empty",
  0x2207: "nabla",
  0x2208: "isin",
  0x2209: "notin",
  0x220b: "ni",
  0x220f: "prod",
  0x2211: "sum",
  0x221a: "radic",
  0x221e: "infin",
  0x2227: "and",
  0x2228: "or",
  0x2229: "cap",
  0x222a: "cup",
  0x222b: "int",
  0x2260: "ne",
  0x2264: "le",
  0x2265: "ge",
  0x2282: "sub",
  0x2283: "sup",
  0x2286: "sube",
  0x2287: "supe",
  0x25ca: "loz",
  0x2660: "spades",
  0x2663: "clubs",
  0x2665: "hearts",
  0x2666: "diams",
};

/** Entity name to character string (e.g. `"amp" -> "&"`). */
export const HTML_ENTITY_TO_CHAR: Record<string, string> = {};

// Build reverse mapping
for (const [cp, name] of Object.entries(HTML_ENTITIES)) {
  HTML_ENTITY_TO_CHAR[name] = String.fromCodePoint(Number(cp));
}

/**
 * Look up the character for an HTML entity string.
 *
 * Accepts bare names (`amp`), ampersand-prefixed (`&amp`), or full entities (`&amp;`).
 *
 * @example
 * ```ts
 * lookupHtmlEntity("amp")     // "&"
 * lookupHtmlEntity("&amp;")   // "&"
 * lookupHtmlEntity("hearts")  // "\u2665"
 * lookupHtmlEntity("unknown") // null
 * ```
 */
export function lookupHtmlEntity(entity: string): string | null {
  // Strip & prefix and ; suffix if present
  let name = entity;
  if (name.startsWith("&")) {
    name = name.slice(1);
  }
  if (name.endsWith(";")) {
    name = name.slice(0, -1);
  }
  return HTML_ENTITY_TO_CHAR[name] ?? null;
}
