// Optional authoring helper. Copies the readable stylesheet to the runtime file.
// The distributed runtime file is minified; after editing it can remain readable.
const fs = require('node:fs');
const path = require('node:path');
const css = path.resolve(__dirname, '../css');
fs.copyFileSync(path.join(css, 'style.source.css'), path.join(css, 'style.css'));
console.log('Styles synchronized. No compiler or external package is required.');
