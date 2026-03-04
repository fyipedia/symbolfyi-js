import { describe, expect, it } from "vitest";

import {
  getEncodings,
  getInfo,
  getCategoryName,
  lookupHtmlEntity,
  HTML_ENTITIES,
  HTML_ENTITY_TO_CHAR,
} from "../src/index.js";

// ── getEncodings ────────────────────────────────────────────────────────────

describe("getEncodings", () => {
  it("encodes right arrow (U+2192)", () => {
    const enc = getEncodings("\u2192"); // →
    expect(enc.unicode).toBe("U+2192");
    expect(enc.htmlDecimal).toBe("&#8594;");
    expect(enc.htmlHex).toBe("&#x2192;");
    expect(enc.htmlEntity).toBe("&rarr;");
    expect(enc.css).toBe("\\2192");
    expect(enc.javascript).toBe("\\u{2192}");
    expect(enc.python).toBe("\\u2192");
    expect(enc.java).toBe("\\u2192");
    expect(enc.utf8Bytes).toBe("e2 86 92");
    expect(enc.utf16Bytes).toBe("21 92");
    expect(enc.urlEncoded).toBe("%E2%86%92");
  });

  it("encodes ASCII character 'A'", () => {
    const enc = getEncodings("A");
    expect(enc.unicode).toBe("U+0041");
    expect(enc.htmlDecimal).toBe("&#65;");
    expect(enc.htmlHex).toBe("&#x41;");
    expect(enc.htmlEntity).toBe("");
    expect(enc.css).toBe("\\0041");
    expect(enc.javascript).toBe("\\u{41}");
    expect(enc.python).toBe("\\u0041");
    expect(enc.java).toBe("\\u0041");
    expect(enc.utf8Bytes).toBe("41");
    expect(enc.utf16Bytes).toBe("00 41");
    expect(enc.urlEncoded).toBe("A");
  });

  it("encodes ampersand with HTML entity", () => {
    const enc = getEncodings("&");
    expect(enc.unicode).toBe("U+0026");
    expect(enc.htmlEntity).toBe("&amp;");
    expect(enc.htmlDecimal).toBe("&#38;");
    expect(enc.utf8Bytes).toBe("26");
    expect(enc.urlEncoded).toBe("%26");
  });

  it("encodes emoji (supplementary plane U+1F600)", () => {
    const enc = getEncodings("\u{1F600}"); // grinning face
    expect(enc.unicode).toBe("U+1F600");
    expect(enc.htmlDecimal).toBe("&#128512;");
    expect(enc.htmlHex).toBe("&#x1F600;");
    expect(enc.htmlEntity).toBe("");
    expect(enc.javascript).toBe("\\u{1F600}");
    expect(enc.python).toBe("\\U0001f600");
    expect(enc.java).toBe("\\uD83D\\uDE00");
    expect(enc.utf8Bytes).toBe("f0 9f 98 80");
    expect(enc.utf16Bytes).toBe("d8 3d de 00");
    expect(enc.urlEncoded).toBe("%F0%9F%98%80");
  });

  it("encodes spade suit with HTML entity", () => {
    const enc = getEncodings("\u2660"); // BLACK SPADE SUIT
    expect(enc.unicode).toBe("U+2660");
    expect(enc.htmlEntity).toBe("&spades;");
    expect(enc.utf8Bytes).toBe("e2 99 a0");
  });

  it("encodes copyright sign", () => {
    const enc = getEncodings("\u00A9"); // copyright
    expect(enc.unicode).toBe("U+00A9");
    expect(enc.htmlEntity).toBe("&copy;");
    expect(enc.htmlDecimal).toBe("&#169;");
    expect(enc.css).toBe("\\00A9");
  });

  it("encodes less-than sign", () => {
    const enc = getEncodings("<");
    expect(enc.htmlEntity).toBe("&lt;");
    expect(enc.htmlDecimal).toBe("&#60;");
  });

  it("encodes euro sign", () => {
    const enc = getEncodings("\u20AC");
    expect(enc.unicode).toBe("U+20AC");
    expect(enc.htmlEntity).toBe("&euro;");
    expect(enc.utf8Bytes).toBe("e2 82 ac");
  });

  it("encodes CJK character", () => {
    const enc = getEncodings("\u4E16"); // world
    expect(enc.unicode).toBe("U+4E16");
    expect(enc.htmlEntity).toBe("");
    expect(enc.utf8Bytes).toBe("e4 b8 96");
    expect(enc.utf16Bytes).toBe("4e 16");
  });

  it("encodes space character", () => {
    const enc = getEncodings(" ");
    expect(enc.unicode).toBe("U+0020");
    expect(enc.htmlDecimal).toBe("&#32;");
    expect(enc.urlEncoded).toBe("%20");
  });

  it("handles unreserved URL characters", () => {
    expect(getEncodings("a").urlEncoded).toBe("a");
    expect(getEncodings("Z").urlEncoded).toBe("Z");
    expect(getEncodings("5").urlEncoded).toBe("5");
    expect(getEncodings("-").urlEncoded).toBe("-");
    expect(getEncodings("_").urlEncoded).toBe("_");
    expect(getEncodings(".").urlEncoded).toBe(".");
    expect(getEncodings("~").urlEncoded).toBe("~");
  });

  it("encodes supplementary plane character (musical symbol)", () => {
    const enc = getEncodings("\u{1D11E}"); // MUSICAL SYMBOL G CLEF
    expect(enc.unicode).toBe("U+1D11E");
    expect(enc.javascript).toBe("\\u{1D11E}");
    expect(enc.python).toBe("\\U0001d11e");
    expect(enc.java).toBe("\\uD834\\uDD1E");
    expect(enc.utf8Bytes).toBe("f0 9d 84 9e");
    expect(enc.utf16Bytes).toBe("d8 34 dd 1e");
  });
});

// ── getInfo ─────────────────────────────────────────────────────────────────

describe("getInfo", () => {
  it("returns info for right arrow", () => {
    const info = getInfo("\u2192");
    expect(info).not.toBeNull();
    expect(info!.codepoint).toBe(0x2192);
    expect(info!.character).toBe("\u2192");
    expect(info!.category).toBe("Sm");
    expect(info!.categoryName).toBe("Math Symbol");
    expect(info!.encodings.unicode).toBe("U+2192");
  });

  it("returns info for uppercase letter", () => {
    const info = getInfo("A");
    expect(info).not.toBeNull();
    expect(info!.codepoint).toBe(65);
    expect(info!.category).toBe("Lu");
    expect(info!.categoryName).toBe("Uppercase Letter");
  });

  it("returns info for lowercase letter", () => {
    const info = getInfo("z");
    expect(info!.category).toBe("Ll");
    expect(info!.categoryName).toBe("Lowercase Letter");
  });

  it("returns info for digit", () => {
    const info = getInfo("7");
    expect(info!.category).toBe("Nd");
    expect(info!.categoryName).toBe("Decimal Number");
  });

  it("returns info for currency symbol", () => {
    const info = getInfo("$");
    expect(info!.category).toBe("Sc");
    expect(info!.categoryName).toBe("Currency Symbol");
  });

  it("returns info for emoji (supplementary plane)", () => {
    const info = getInfo("\u{1F600}");
    expect(info).not.toBeNull();
    expect(info!.codepoint).toBe(0x1f600);
    expect(info!.category).toBe("So");
    expect(info!.categoryName).toBe("Other Symbol");
  });

  it("returns null for empty string", () => {
    expect(getInfo("")).toBeNull();
  });

  it("returns info for space separator", () => {
    const info = getInfo(" ");
    expect(info!.category).toBe("Zs");
    expect(info!.categoryName).toBe("Space Separator");
  });

  it("detects punctuation categories", () => {
    expect(getInfo("(")!.category).toBe("Ps"); // Open Punctuation
    expect(getInfo(")")!.category).toBe("Pe"); // Close Punctuation
    expect(getInfo("-")!.category).toBe("Pd"); // Dash Punctuation
    expect(getInfo("!")!.category).toBe("Po"); // Other Punctuation
  });
});

// ── getCategoryName ─────────────────────────────────────────────────────────

describe("getCategoryName", () => {
  it("returns name for known categories", () => {
    expect(getCategoryName("Sm")).toBe("Math Symbol");
    expect(getCategoryName("Lu")).toBe("Uppercase Letter");
    expect(getCategoryName("Nd")).toBe("Decimal Number");
    expect(getCategoryName("So")).toBe("Other Symbol");
    expect(getCategoryName("Cc")).toBe("Control");
  });

  it("returns code as-is for unknown categories", () => {
    expect(getCategoryName("Xx")).toBe("Xx");
    expect(getCategoryName("")).toBe("");
  });
});

// ── lookupHtmlEntity ────────────────────────────────────────────────────────

describe("lookupHtmlEntity", () => {
  it("finds amp entity", () => {
    expect(lookupHtmlEntity("amp")).toBe("&");
    expect(lookupHtmlEntity("&amp;")).toBe("&");
    expect(lookupHtmlEntity("&amp")).toBe("&");
  });

  it("finds hearts entity", () => {
    expect(lookupHtmlEntity("hearts")).toBe("\u2665");
    expect(lookupHtmlEntity("&hearts;")).toBe("\u2665");
  });

  it("finds lt and gt", () => {
    expect(lookupHtmlEntity("lt")).toBe("<");
    expect(lookupHtmlEntity("gt")).toBe(">");
  });

  it("returns null for unknown entities", () => {
    expect(lookupHtmlEntity("unknown")).toBeNull();
    expect(lookupHtmlEntity("&fake;")).toBeNull();
  });

  it("handles all 51 entities", () => {
    const count = Object.keys(HTML_ENTITIES).length;
    expect(count).toBe(51);

    // Every entity should have a reverse mapping
    const reverseCount = Object.keys(HTML_ENTITY_TO_CHAR).length;
    expect(reverseCount).toBe(51);
  });
});

// ── Cross-validation with Python output ─────────────────────────────────────

describe("cross-validation with Python symbolfyi", () => {
  it("matches Python output for spade suit", () => {
    // Python: get_encodings("♠")
    const enc = getEncodings("\u2660");
    expect(enc.unicode).toBe("U+2660");
    expect(enc.htmlDecimal).toBe("&#9824;");
    expect(enc.htmlHex).toBe("&#x2660;");
    expect(enc.htmlEntity).toBe("&spades;");
    expect(enc.css).toBe("\\2660");
    expect(enc.javascript).toBe("\\u{2660}");
    expect(enc.python).toBe("\\u2660");
    expect(enc.java).toBe("\\u2660");
    expect(enc.utf8Bytes).toBe("e2 99 a0");
    expect(enc.utf16Bytes).toBe("26 60");
    expect(enc.urlEncoded).toBe("%E2%99%A0");
  });

  it("matches Python output for infinity", () => {
    const enc = getEncodings("\u221E");
    expect(enc.unicode).toBe("U+221E");
    expect(enc.htmlEntity).toBe("&infin;");
    expect(enc.utf8Bytes).toBe("e2 88 9e");
  });
});
