/**
 * symbolfyi -- Pure TypeScript symbol encoder.
 *
 * Compute 11 encoding representations (Unicode, HTML, CSS, JavaScript,
 * Python, Java, UTF-8, UTF-16, URL) for any Unicode character.
 * Includes 51 HTML entity mappings.
 *
 * Zero dependencies.
 *
 * @example
 * ```ts
 * import { getEncodings, getInfo, lookupHtmlEntity } from "symbolfyi";
 *
 * // Encode any character
 * const enc = getEncodings("→");
 * enc.unicode     // "U+2192"
 * enc.htmlEntity  // "&rarr;"
 * enc.css         // "\\2192"
 * enc.utf8Bytes   // "e2 86 92"
 *
 * // Full character info
 * const info = getInfo("♠");
 * info?.category      // "So"
 * info?.categoryName  // "Other Symbol"
 *
 * // HTML entity lookup
 * lookupHtmlEntity("&hearts;")  // "♥"
 * ```
 *
 * @see https://symbolfyi.com
 * @see https://pypi.org/project/symbolfyi/
 * @packageDocumentation
 */

// Types
export type { EncodingInfo, SymbolInfo } from "./types.js";

// Core functions
export { getEncodings, getInfo, getCategoryName } from "./engine.js";

// Entity data & lookup
export {
  HTML_ENTITIES,
  HTML_ENTITY_TO_CHAR,
  lookupHtmlEntity,
} from "./entities.js";
