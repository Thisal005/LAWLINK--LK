import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pdfParseIndexPath = join(__dirname, 'node_modules/pdf-parse/index.js');
let content = readFileSync(pdfParseIndexPath, 'utf8');

// Split the content into lines
let lines = content.split('\n');

// Remove lines 12 to 26 (0-based index: 11 to 25)
lines.splice(11, 15); // Line 12 to 26 inclusive (15 lines)

// Join the lines back together
content = lines.join('\n');

writeFileSync(pdfParseIndexPath, content, 'utf8');
console.log('Patched pdf-parse/index.js: Removed lines 12-26');