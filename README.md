# symbolfyi

Pure TypeScript symbol encoder -- 11 encoding formats for any Unicode character. Zero dependencies.

[![npm version](https://img.shields.io/npm/v/symbolfyi)](https://www.npmjs.com/package/symbolfyi)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](https://www.npmjs.com/package/symbolfyi)

Part of the [FYIPedia](https://github.com/fyipedia) open-source ecosystem. TypeScript port of the Python [`symbolfyi`](https://pypi.org/project/symbolfyi/) package.

<p align="center">
  <img src="demo.gif" alt="symbolfyi demo — symbol encoding and Unicode lookup" width="800">
</p>

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [What You Can Do](#what-you-can-do)
  - [Symbol Encoding](#symbol-encoding)
  - [Unicode Properties](#unicode-properties)
  - [HTML Entity Lookup](#html-entity-lookup)
- [API Reference](#api-reference)
- [Encoding Formats](#encoding-formats)
- [Supplementary Plane Support](#supplementary-plane-support)
- [Learn More About Symbols](#learn-more-about-symbols)
- [Also Available](#also-available)
- [Creative FYI Family](#creative-fyi-family)
- [License](#license)

## Features

- **11 encoding formats** for any Unicode character (BMP + supplementary plane)
- **51 HTML entity** mappings with bidirectional lookup
- **Unicode category detection** using ES2018 Unicode property escapes
- **Zero dependencies** -- pure TypeScript, works in Node.js and browsers
- **Full surrogate pair support** for emoji and supplementary plane characters

## Installation

```bash
npm install symbolfyi
```

## Quick Start

```typescript
import { getEncodings, getInfo, lookupHtmlEntity } from "symbolfyi";

// Encode any character into 11 formats
const enc = getEncodings("→");
enc.unicode     // "U+2192"
enc.htmlDecimal // "&#8594;"
enc.htmlHex     // "&#x2192;"
enc.htmlEntity  // "&rarr;"
enc.css         // "\\2192"
enc.javascript  // "\\u{2192}"
enc.python      // "\\u2192"
enc.java        // "\\u2192"
enc.utf8Bytes   // "e2 86 92"
enc.utf16Bytes  // "21 92"
enc.urlEncoded  // "%E2%86%92"

// Get character info with category detection
const info = getInfo("$");
info?.category      // "Sc"
info?.categoryName  // "Currency Symbol"
info?.codepoint     // 36

// Look up HTML entities
lookupHtmlEntity("&hearts;")  // "♥"
lookupHtmlEntity("amp")       // "&"
```

## What You Can Do

### Symbol Encoding

Encode any Unicode character into **11 different representations** for use in HTML, CSS, JavaScript, Python, Java, and more. The encoder handles both BMP characters (U+0000-U+FFFF) and supplementary plane characters (U+10000+, including emoji) with correct surrogate pair encoding where needed.

| # | Format | BMP Example (`→`) | Supplementary Example (`U+1F600`) | Use Case |
|---|--------|-------------------|----------------------------------|----------|
| 1 | **Unicode** | `U+2192` | `U+1F600` | Documentation, character charts |
| 2 | **HTML Decimal** | `&#8594;` | `&#128512;` | HTML content (numeric reference) |
| 3 | **HTML Hex** | `&#x2192;` | `&#x1F600;` | HTML content (hex reference) |
| 4 | **HTML Entity** | `&rarr;` | *(none)* | HTML shorthand (51 common entities) |
| 5 | **CSS** | `\2192` | `\1F600` | CSS `content` property |
| 6 | **JavaScript** | `\u{2192}` | `\u{1F600}` | ES6+ string literals |
| 7 | **Python** | `\u2192` | `\U0001f600` | Python string escapes |
| 8 | **Java** | `\u2192` | `\uD83D\uDE00` | Java (surrogate pairs for U+10000+) |
| 9 | **UTF-8 Bytes** | `e2 86 92` | `f0 9f 98 80` | Network protocols, file I/O |
| 10 | **UTF-16 Bytes** | `21 92` | `d8 3d de 00` | Windows APIs, Java internals |
| 11 | **URL Encoded** | `%E2%86%92` | `%F0%9F%98%80` | URLs, query strings |

```typescript
import { getEncodings } from "symbolfyi";

// Encode the rightwards arrow into all 11 formats
const enc = getEncodings("\u2192");
console.log(enc.unicode);      // "U+2192"
console.log(enc.htmlEntity);   // "&rarr;"
console.log(enc.css);          // "\\2192"
console.log(enc.javascript);   // "\\u{2192}"
console.log(enc.utf8Bytes);    // "e2 86 92"
console.log(enc.urlEncoded);   // "%E2%86%92"
```

Learn more: [Symbol Encoder](https://symbolfyi.com/search/) · [HTML Entity Collections](https://symbolfyi.com/collection/) · [Unicode Blocks](https://symbolfyi.com/block/)

### Unicode Properties

Every Unicode character belongs to one of **30 general categories** (e.g., "Math Symbol", "Currency Symbol", "Uppercase Letter"). The `getInfo()` function returns the character's codepoint, category, human-readable category name, and all 11 encodings.

| Category Code | Category Name | Example Characters |
|--------------|---------------|-------------------|
| `Lu` | Uppercase Letter | A, B, C, ..., Z |
| `Ll` | Lowercase Letter | a, b, c, ..., z |
| `Nd` | Decimal Number | 0, 1, 2, ..., 9 |
| `Sm` | Math Symbol | +, =, <, >, ~ |
| `Sc` | Currency Symbol | $, EUR, GBP, JPY |
| `So` | Other Symbol | (C), (R), (TM), ... |
| `Ps` | Open Punctuation | (, [, { |
| `Pe` | Close Punctuation | ), ], } |

```typescript
import { getInfo, getCategoryName } from "symbolfyi";

// Get full Unicode properties for any character
const info = getInfo("$");
console.log(info?.codepoint);      // 36
console.log(info?.category);       // "Sc"
console.log(info?.categoryName);   // "Currency Symbol"
console.log(info?.encodings.htmlHex);  // "&#x24;"

// Look up category names
console.log(getCategoryName("Sm"));  // "Math Symbol"
console.log(getCategoryName("Lu"));  // "Uppercase Letter"
console.log(getCategoryName("Nd"));  // "Decimal Number"
```

Learn more: [Unicode Category Reference](https://symbolfyi.com/glossary/) · [Unicode Blocks](https://symbolfyi.com/block/) · [REST API Docs](https://symbolfyi.com/developers/)

### HTML Entity Lookup

Resolve **51 common HTML named entities** back to their characters. Accepts bare names (`amp`), `&`-prefixed (`&amp`), or full format (`&amp;`).

```typescript
import { lookupHtmlEntity, HTML_ENTITIES, HTML_ENTITY_TO_CHAR } from "symbolfyi";

// Reverse lookup: entity name to character
console.log(lookupHtmlEntity("&hearts;"));  // "heart character"
console.log(lookupHtmlEntity("amp"));       // "&"
console.log(lookupHtmlEntity("&rarr;"));    // "rightwards arrow"
console.log(lookupHtmlEntity("unknown"));   // null

// Direct data access
console.log(HTML_ENTITIES[0x2192]);           // "rarr"
console.log(HTML_ENTITY_TO_CHAR["rarr"]);     // "rightwards arrow character"
```

Learn more: [HTML Entity Reference](https://symbolfyi.com/collection/) · [Math Symbols](https://symbolfyi.com/collection/math/) · [Currency Symbols](https://symbolfyi.com/collection/currency/)

## API Reference

### `getEncodings(char: string): EncodingInfo`

Compute all 11 encoding representations for a single Unicode character.

| Property | Example (`→`) | Description |
|----------|---------------|-------------|
| `unicode` | `U+2192` | Unicode codepoint notation |
| `htmlDecimal` | `&#8594;` | HTML decimal entity |
| `htmlHex` | `&#x2192;` | HTML hexadecimal entity |
| `htmlEntity` | `&rarr;` | Named HTML entity (empty if none) |
| `css` | `\2192` | CSS escape sequence |
| `javascript` | `\u{2192}` | JavaScript escape sequence |
| `python` | `\u2192` | Python escape (`\U` for supplementary) |
| `java` | `\u2192` | Java escape (surrogate pairs for supplementary) |
| `utf8Bytes` | `e2 86 92` | UTF-8 byte representation |
| `utf16Bytes` | `21 92` | UTF-16 BE byte representation |
| `urlEncoded` | `%E2%86%92` | URL percent-encoded |

### `getInfo(char: string): SymbolInfo | null`

Get Unicode character info including category and all encodings. Returns `null` for empty input.

```typescript
interface SymbolInfo {
  codepoint: number;        // 8594
  character: string;        // "→"
  category: string;         // "Sm"
  categoryName: string;     // "Math Symbol"
  encodings: EncodingInfo;  // All 11 formats
}
```

### `getCategoryName(code: string): string`

Get the full name for a Unicode general category code.

```typescript
getCategoryName("Sm")  // "Math Symbol"
getCategoryName("Lu")  // "Uppercase Letter"
getCategoryName("Nd")  // "Decimal Number"
```

### `lookupHtmlEntity(entity: string): string | null`

Look up the character for an HTML entity. Accepts bare names, `&`-prefixed, or full `&...;` format.

```typescript
lookupHtmlEntity("amp")      // "&"
lookupHtmlEntity("&amp;")    // "&"
lookupHtmlEntity("&hearts;") // "♥"
lookupHtmlEntity("unknown")  // null
```

### Data Exports

```typescript
import { HTML_ENTITIES, HTML_ENTITY_TO_CHAR } from "symbolfyi";

// Codepoint → entity name
HTML_ENTITIES[0x2192]  // "rarr"

// Entity name → character
HTML_ENTITY_TO_CHAR["rarr"]  // "→"
```

## Encoding Formats

| # | Format | BMP Example | Supplementary Example |
|---|--------|-------------|----------------------|
| 1 | Unicode | `U+2192` | `U+1F600` |
| 2 | HTML Decimal | `&#8594;` | `&#128512;` |
| 3 | HTML Hex | `&#x2192;` | `&#x1F600;` |
| 4 | HTML Entity | `&rarr;` | *(none)* |
| 5 | CSS | `\2192` | `\1F600` |
| 6 | JavaScript | `\u{2192}` | `\u{1F600}` |
| 7 | Python | `\u2192` | `\U0001f600` |
| 8 | Java | `\u2192` | `\uD83D\uDE00` |
| 9 | UTF-8 | `e2 86 92` | `f0 9f 98 80` |
| 10 | UTF-16 | `21 92` | `d8 3d de 00` |
| 11 | URL | `%E2%86%92` | `%F0%9F%98%80` |

## Supplementary Plane Support

Characters above U+FFFF (emoji, musical symbols, etc.) are fully supported:

```typescript
const enc = getEncodings("\u{1F600}");  // 😀
enc.unicode     // "U+1F600"
enc.javascript  // "\\u{1F600}"
enc.python      // "\\U0001f600"
enc.java        // "\\uD83D\\uDE00"  (surrogate pair)
enc.utf8Bytes   // "f0 9f 98 80"
enc.utf16Bytes  // "d8 3d de 00"
```

## Learn More About Symbols

- **Browse**: [Symbol Search](https://symbolfyi.com/search/) · [Unicode Blocks](https://symbolfyi.com/block/)
- **Collections**: [HTML Entities](https://symbolfyi.com/collection/) · [Math Symbols](https://symbolfyi.com/collection/math/)
- **API**: [REST API Docs](https://symbolfyi.com/developers/) · [OpenAPI Spec](https://symbolfyi.com/api/openapi.json)
- **Python**: [PyPI Package](https://pypi.org/project/symbolfyi/)

## Also Available

- **Python**: [`pip install symbolfyi`](https://pypi.org/project/symbolfyi/) -- the original package with `unicodedata` integration
- **Web**: [symbolfyi.com](https://symbolfyi.com) -- look up any symbol's encodings online

## Creative FYI Family

Part of the [FYIPedia](https://fyipedia.com) open-source developer tools ecosystem — design, typography, and character encoding.

| Package | PyPI | npm | Description |
|---------|------|-----|-------------|
| colorfyi | [PyPI](https://pypi.org/project/colorfyi/) | [npm](https://www.npmjs.com/package/@fyipedia/colorfyi) | Color conversion, WCAG contrast, harmonies -- [colorfyi.com](https://colorfyi.com/) |
| emojifyi | [PyPI](https://pypi.org/project/emojifyi/) | [npm](https://www.npmjs.com/package/emojifyi) | Emoji encoding & metadata for 3,953 emojis -- [emojifyi.com](https://emojifyi.com/) |
| **symbolfyi** | [PyPI](https://pypi.org/project/symbolfyi/) | [npm](https://www.npmjs.com/package/symbolfyi) | **Symbol encoding in 11 formats -- [symbolfyi.com](https://symbolfyi.com/)** |
| unicodefyi | [PyPI](https://pypi.org/project/unicodefyi/) | [npm](https://www.npmjs.com/package/unicodefyi) | Unicode lookup with 17 encodings -- [unicodefyi.com](https://unicodefyi.com/) |
| fontfyi | [PyPI](https://pypi.org/project/fontfyi/) | [npm](https://www.npmjs.com/package/fontfyi) | Google Fonts metadata & CSS -- [fontfyi.com](https://fontfyi.com/) |

## License

MIT -- [FYIPedia](https://github.com/fyipedia)
