/**
 * 11 encoding representations for a Unicode character.
 *
 * @see https://symbolfyi.com
 */
export interface EncodingInfo {
  /** Unicode codepoint notation, e.g. `U+2192` */
  unicode: string;
  /** HTML decimal entity, e.g. `&#8594;` */
  htmlDecimal: string;
  /** HTML hexadecimal entity, e.g. `&#x2192;` */
  htmlHex: string;
  /** Named HTML entity if one exists, e.g. `&rarr;` (empty string otherwise) */
  htmlEntity: string;
  /** CSS escape sequence, e.g. `\2192` */
  css: string;
  /** JavaScript escape sequence, e.g. `\u{2192}` */
  javascript: string;
  /** Python escape sequence, e.g. `\u2192` or `\U00010000` for supplementary */
  python: string;
  /** Java escape sequence, e.g. `\u2192` or surrogate pair for supplementary */
  java: string;
  /** UTF-8 byte representation, e.g. `e2 86 92` */
  utf8Bytes: string;
  /** UTF-16 BE byte representation, e.g. `21 92` */
  utf16Bytes: string;
  /** URL percent-encoded string, e.g. `%E2%86%92` */
  urlEncoded: string;
}

/**
 * Full Unicode character info including properties and encodings.
 *
 * @see https://symbolfyi.com
 */
export interface SymbolInfo {
  /** Numeric codepoint value */
  codepoint: number;
  /** The character itself */
  character: string;
  /** Unicode general category code, e.g. `Sm` */
  category: string;
  /** Full category name, e.g. `Math Symbol` */
  categoryName: string;
  /** All 11 encoding representations */
  encodings: EncodingInfo;
}
