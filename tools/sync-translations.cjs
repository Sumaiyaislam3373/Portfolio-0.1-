const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const dictionaries = {};
for (const lang of ['en','bn']) dictionaries[lang] = JSON.parse(fs.readFileSync(path.join(root,'data',lang+'.json'),'utf8'));
for (const key of Object.keys(dictionaries.en)) if (typeof dictionaries.bn[key] !== 'string') throw Error('Missing Bengali translation: '+key);
for (const [lang,copy] of Object.entries(dictionaries)) fs.writeFileSync(path.join(root,'data',lang+'.js'),'window.PortfolioCopy = window.PortfolioCopy || {};\nwindow.PortfolioCopy.'+lang+' = '+JSON.stringify(copy,null,2)+';\n');
console.log('English and Bengali runtime dictionaries updated.');
