import { getEncodings, getInfo, lookupHtmlEntity } from './dist/index.js'

const C = { r: '\x1b[0m', b: '\x1b[1m', d: '\x1b[2m', y: '\x1b[33m', g: '\x1b[32m', c: '\x1b[36m', m: '\x1b[35m' }

// 1. Encode → to 11 formats
const enc = getEncodings('→')
console.log(`${C.b}${C.y}Encode: → ${C.d}(RIGHTWARDS ARROW)${C.r}`)
console.log(`  ${C.c}Unicode ${C.r} ${C.g}${enc.unicode}${C.r}`)
console.log(`  ${C.c}HTML    ${C.r} ${C.g}${enc.htmlEntity || enc.htmlDecimal}${C.r}`)
console.log(`  ${C.c}CSS     ${C.r} ${C.g}${enc.css}${C.r}`)
console.log(`  ${C.c}JS      ${C.r} ${C.g}${enc.javascript}${C.r}`)
console.log(`  ${C.c}Python  ${C.r} ${C.g}${enc.python}${C.r}`)
console.log(`  ${C.c}UTF-8   ${C.r} ${C.g}${enc.utf8Bytes}${C.r}`)

console.log()

// 2. Symbol info
const info = getInfo('©')
console.log(`${C.b}${C.y}Info: © ${C.d}(COPYRIGHT SIGN)${C.r}`)
console.log(`  ${C.c}Codepoint${C.r} ${C.g}U+${info.codepoint.toString(16).toUpperCase().padStart(4, '0')}${C.r}`)
console.log(`  ${C.c}Category ${C.r} ${C.g}${info.categoryName}${C.r}`)
console.log(`  ${C.c}HTML     ${C.r} ${C.g}${info.encodings.htmlEntity}${C.r}`)

console.log()

// 3. Entity lookup
console.log(`${C.b}${C.y}HTML Entity Lookup${C.r}`)
for (const ent of ['&hearts;', '&amp;', '&infin;', '&copy;']) {
  console.log(`  ${C.c}${ent.padEnd(10)}${C.r} → ${C.g}${lookupHtmlEntity(ent)}${C.r}`)
}
