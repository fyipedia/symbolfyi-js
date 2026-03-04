/**
 * Symbol encoding engine -- 11 encoding formats for any Unicode character.
 *
 * Pure TypeScript, zero dependencies. Ported from the Python `symbolfyi` package.
 *
 * @see https://symbolfyi.com
 * @see https://pypi.org/project/symbolfyi/
 */

import { HTML_ENTITIES } from "./entities.js";
import type { EncodingInfo, SymbolInfo } from "./types.js";

// ── Unicode general category names ──────────────────────────────────────────

const GENERAL_CATEGORIES: Record<string, string> = {
  Lu: "Uppercase Letter",
  Ll: "Lowercase Letter",
  Lt: "Titlecase Letter",
  Lm: "Modifier Letter",
  Lo: "Other Letter",
  Mn: "Nonspacing Mark",
  Mc: "Spacing Mark",
  Me: "Enclosing Mark",
  Nd: "Decimal Number",
  Nl: "Letter Number",
  No: "Other Number",
  Pc: "Connector Punctuation",
  Pd: "Dash Punctuation",
  Ps: "Open Punctuation",
  Pe: "Close Punctuation",
  Pi: "Initial Punctuation",
  Pf: "Final Punctuation",
  Po: "Other Punctuation",
  Sm: "Math Symbol",
  Sc: "Currency Symbol",
  Sk: "Modifier Symbol",
  So: "Other Symbol",
  Zs: "Space Separator",
  Zl: "Line Separator",
  Zp: "Paragraph Separator",
  Cc: "Control",
  Cf: "Format",
};

// ── Internal helpers ────────────────────────────────────────────────────────

/**
 * Extract the single codepoint from a string.
 * Handles surrogate pairs (supplementary plane characters) via codePointAt.
 */
function toCodepoint(char: string): number {
  const cp = char.codePointAt(0);
  if (cp === undefined) {
    throw new Error("Empty string passed to toCodepoint");
  }
  return cp;
}

/** Pad a hex string to at least `width` characters with leading zeros. */
function padHex(n: number, width: number): string {
  return n.toString(16).padStart(width, "0");
}

/** Upper-case hex padded to at least `width`. */
function padHexUpper(n: number, width: number): string {
  return n.toString(16).toUpperCase().padStart(width, "0");
}

/**
 * Encode a codepoint to UTF-8 bytes.
 * Returns an array of byte values.
 */
function encodeUtf8(cp: number): number[] {
  if (cp <= 0x7f) {
    return [cp];
  }
  if (cp <= 0x7ff) {
    return [0xc0 | (cp >> 6), 0x80 | (cp & 0x3f)];
  }
  if (cp <= 0xffff) {
    return [
      0xe0 | (cp >> 12),
      0x80 | ((cp >> 6) & 0x3f),
      0x80 | (cp & 0x3f),
    ];
  }
  // Supplementary plane (U+10000..U+10FFFF)
  return [
    0xf0 | (cp >> 18),
    0x80 | ((cp >> 12) & 0x3f),
    0x80 | ((cp >> 6) & 0x3f),
    0x80 | (cp & 0x3f),
  ];
}

/**
 * Encode a codepoint to UTF-16 BE bytes.
 * Returns an array of byte values.
 */
function encodeUtf16BE(cp: number): number[] {
  if (cp <= 0xffff) {
    return [(cp >> 8) & 0xff, cp & 0xff];
  }
  // Surrogate pair
  const high = 0xd800 + ((cp - 0x10000) >> 10);
  const low = 0xdc00 + ((cp - 0x10000) & 0x3ff);
  return [
    (high >> 8) & 0xff,
    high & 0xff,
    (low >> 8) & 0xff,
    low & 0xff,
  ];
}

/** Format byte array as space-separated lowercase hex. */
function bytesToHex(bytes: number[]): string {
  return bytes.map((b) => padHex(b, 2)).join(" ");
}

/**
 * URL-encode a character by percent-encoding its UTF-8 bytes.
 * Unreserved characters (A-Z, a-z, 0-9, - _ . ~) are not encoded.
 */
function urlEncode(char: string, cp: number): string {
  // Check if unreserved (RFC 3986)
  if (
    (cp >= 0x41 && cp <= 0x5a) || // A-Z
    (cp >= 0x61 && cp <= 0x7a) || // a-z
    (cp >= 0x30 && cp <= 0x39) || // 0-9
    cp === 0x2d || // -
    cp === 0x5f || // _
    cp === 0x2e || // .
    cp === 0x7e // ~
  ) {
    return char;
  }
  const bytes = encodeUtf8(cp);
  return bytes.map((b) => "%" + padHexUpper(b, 2)).join("");
}

/**
 * Heuristic Unicode general category detection.
 *
 * JavaScript has no native `unicodedata.category()` equivalent, so we use
 * regex Unicode property escapes (ES2018) to classify characters.
 */
function detectCategory(char: string): string {
  // Order matters -- test more specific patterns first
  if (/^\p{Lu}$/u.test(char)) return "Lu";
  if (/^\p{Ll}$/u.test(char)) return "Ll";
  if (/^\p{Lt}$/u.test(char)) return "Lt";
  if (/^\p{Lm}$/u.test(char)) return "Lm";
  if (/^\p{Lo}$/u.test(char)) return "Lo";
  if (/^\p{Mn}$/u.test(char)) return "Mn";
  if (/^\p{Mc}$/u.test(char)) return "Mc";
  if (/^\p{Me}$/u.test(char)) return "Me";
  if (/^\p{Nd}$/u.test(char)) return "Nd";
  if (/^\p{Nl}$/u.test(char)) return "Nl";
  if (/^\p{No}$/u.test(char)) return "No";
  if (/^\p{Pc}$/u.test(char)) return "Pc";
  if (/^\p{Pd}$/u.test(char)) return "Pd";
  if (/^\p{Ps}$/u.test(char)) return "Ps";
  if (/^\p{Pe}$/u.test(char)) return "Pe";
  if (/^\p{Pi}$/u.test(char)) return "Pi";
  if (/^\p{Pf}$/u.test(char)) return "Pf";
  if (/^\p{Po}$/u.test(char)) return "Po";
  if (/^\p{Sm}$/u.test(char)) return "Sm";
  if (/^\p{Sc}$/u.test(char)) return "Sc";
  if (/^\p{Sk}$/u.test(char)) return "Sk";
  if (/^\p{So}$/u.test(char)) return "So";
  if (/^\p{Zs}$/u.test(char)) return "Zs";
  if (/^\p{Zl}$/u.test(char)) return "Zl";
  if (/^\p{Zp}$/u.test(char)) return "Zp";
  if (/^\p{Cc}$/u.test(char)) return "Cc";
  if (/^\p{Cf}$/u.test(char)) return "Cf";
  return "Cn"; // unassigned
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Compute 11 encoding representations for a single Unicode character.
 *
 * @param char - A single Unicode character (may be 2 JS code units for supplementary plane)
 * @returns All 11 encoding formats
 *
 * @example
 * ```ts
 * const enc = getEncodings("→");
 * enc.unicode     // "U+2192"
 * enc.htmlEntity  // "&rarr;"
 * enc.utf8Bytes   // "e2 86 92"
 * enc.css         // "\\2192"
 * ```
 */
export function getEncodings(char: string): EncodingInfo {
  const cp = toCodepoint(char);
  const hex = cp.toString(16).toUpperCase();

  // Python representation
  let python: string;
  if (cp <= 0xffff) {
    python = `\\u${padHex(cp, 4)}`;
  } else {
    python = `\\U${padHex(cp, 8)}`;
  }

  // Java representation (surrogate pairs for supplementary plane)
  let java: string;
  if (cp <= 0xffff) {
    java = `\\u${padHexUpper(cp, 4)}`;
  } else {
    const high = 0xd800 + ((cp - 0x10000) >> 10);
    const low = 0xdc00 + ((cp - 0x10000) & 0x3ff);
    java = `\\u${padHexUpper(high, 4)}\\u${padHexUpper(low, 4)}`;
  }

  // HTML entity lookup
  const entityName = HTML_ENTITIES[cp];
  const htmlEntity = entityName ? `&${entityName};` : "";

  return {
    unicode: `U+${padHexUpper(cp, 4)}`,
    htmlDecimal: `&#${cp};`,
    htmlHex: `&#x${hex};`,
    htmlEntity,
    css: `\\${padHexUpper(cp, 4)}`,
    javascript: `\\u{${hex}}`,
    python,
    java,
    utf8Bytes: bytesToHex(encodeUtf8(cp)),
    utf16Bytes: bytesToHex(encodeUtf16BE(cp)),
    urlEncoded: urlEncode(char, cp),
  };
}

/**
 * Get Unicode character info including category and all encodings.
 *
 * Uses JavaScript regex Unicode property escapes for category detection.
 * Does not include Unicode name (no native JS API for that).
 *
 * @param char - A single Unicode character
 * @returns Character info, or `null` for empty input
 *
 * @example
 * ```ts
 * const info = getInfo("→");
 * info?.category      // "Sm"
 * info?.categoryName  // "Math Symbol"
 * info?.encodings.unicode  // "U+2192"
 * ```
 */
export function getInfo(char: string): SymbolInfo | null {
  if (!char || char.length === 0) {
    return null;
  }

  const cp = toCodepoint(char);
  // Get the actual single character (handles surrogate pairs)
  const singleChar = String.fromCodePoint(cp);
  const category = detectCategory(singleChar);

  return {
    codepoint: cp,
    character: singleChar,
    category,
    categoryName: getCategoryName(category),
    encodings: getEncodings(singleChar),
  };
}

/**
 * Get the full name for a Unicode general category code.
 *
 * @example
 * ```ts
 * getCategoryName("Sm")  // "Math Symbol"
 * getCategoryName("Lu")  // "Uppercase Letter"
 * getCategoryName("Xx")  // "Xx" (unknown codes returned as-is)
 * ```
 */
export function getCategoryName(code: string): string {
  return GENERAL_CATEGORIES[code] ?? code;
}

export { lookupHtmlEntity } from "./entities.js";
