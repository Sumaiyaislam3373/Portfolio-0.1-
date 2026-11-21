// Run from anywhere: node tools/configure-domain.cjs https://your-domain.example/
// Supports subdirectory hosting, including GitHub Pages project paths.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const argument = process.argv[2];
if (!argument) throw Error('Pass the final HTTPS website URL, including its project path if hosted in a subdirectory.');
const site = new URL(argument);
if (site.protocol !== 'https:' || site.username || site.password || site.search || site.hash) throw Error('Use an HTTPS URL without credentials, query parameters or fragments.');
site.pathname = site.pathname.replace(/\/*$/, '/');
const base = site.href;
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
html = html.replace(/<link rel="canonical"[^>]*>\s*/g, '').replace(/<meta property="og:url"[^>]*>\s*/g, '');
html = html.replace(/<meta property="og:image"[^>]*>/, '<meta property="og:image" content="'+escape(new URL('assets/social-preview.png',base).href)+'">');
html = html.replace(/<meta name="twitter:image"[^>]*>/, '<meta name="twitter:image" content="'+escape(new URL('assets/social-preview.png',base).href)+'">');
html = html.replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="index,follow">');
html = html.replace('</head>', '<link rel="canonical" href="'+escape(base)+'"><meta property="og:url" content="'+escape(base)+'"></head>');
html = html.replace(/<script type="application\/ld\+json" id="person-schema">([\s\S]*?)<\/script>/, (_full, raw) => {
  const person = JSON.parse(raw);person.url=base;
  return '<script type="application/ld+json" id="person-schema">'+JSON.stringify(person).replaceAll('<','\\u003c')+'</script>';
});
fs.writeFileSync(path.join(root,'index.html'),html);
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>'+escape(base)+'</loc></url></urlset>\n';
fs.writeFileSync(path.join(root,'sitemap.xml'),sitemap);
// robots.txt is effective only at the origin root; subdirectory hosts control it separately.
if(site.pathname==='/')fs.writeFileSync(path.join(root,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: '+new URL('sitemap.xml',base).href+'\n');
fs.writeFileSync(path.join(root,'DEPLOYMENT-URL.txt'),base+'\n');
console.log('Configured canonical URL, social image URLs, Person URL, sitemap and indexability for '+base);
if(site.pathname!=='/')console.log('Subdirectory hosting: robots.txt is controlled at the origin root; the page robots meta is set to index,follow.');
