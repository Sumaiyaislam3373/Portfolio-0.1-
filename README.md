# Sumaiya Islam Jebin — Portfolio

Complete static HTML, CSS and JavaScript portfolio, prepared for the GitHub repository **Sumaiyaislam3373/Portfolio-0.1-**. No npm install, build step, PHP or server database is required.

## GitHub-এ upload করার নিয়ম

1. ZIP file extract করুন। ZIP file-টি repository-তে upload করবেন না।
2. Repository খুলে **Add file → Upload files** নির্বাচন করুন।
3. Extract করা folder-এর **ভেতরের সব file ও folder** upload করুন। Repository-এর একদম প্রথম স্তরে index.html, assets, css, data এবং js থাকতে হবে।
4. **Commit changes** করুন। তারপর **Settings → Pages → Deploy from a branch → main → /(root) → Save** দিন। অন্য default branch ব্যবহার করলে সেটি নির্বাচন করুন।
5. Deployment শেষ হলে Pages settings-এ website URL দেখাবে।

এই repository-এর জন্য expected address: https://sumaiyaislam3373.github.io/Portfolio-0.1-/
এই ZIP নিজে থেকে GitHub-এ upload বা deploy করা হয়নি।

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Included

- SJ orbital logo, favicon and touch icon
- English and Bangla translations with saved language preference
- Job Tracking gallery with 11 real screenshots, captions and full-size links
- Edurise and Doctor website scroll previews
- StemWave landing-page showcase and Evonacart WordPress showcase
- Project filters, project detail dialogs, mobile menu and reduced-motion support
- Contact links, email-draft inquiry form, downloadable CV
- Self-hosted fonts and their license files
- Readable CSS source and optional maintenance helpers

## Structure

```text
index.html
assets/
css/style.css
css/style.source.css
data/
js/
tools/
docs/
.nojekyll
robots.txt
sitemap.xml
```

## Preview locally

Open index.html directly, or serve this folder with a static server. For example, if Python is installed: `python -m http.server 8000`, then open http://localhost:8000.

## Editing

- Page layout: index.html
- English / Bangla copy: data/en.json and data/bn.json; run `node tools/sync-translations.cjs` after editing them.
- Styles: css/style.source.css; run `node tools/sync-styles.cjs` after editing it.
- Project descriptions: data/projects.js
- Software gallery: data/software-views.js
- Images, logo and CV: assets/

Node.js is needed only for the optional maintenance commands, never to run the website.

## Another repository or custom domain

The export's canonical, social-image and sitemap URLs are configured for the repository named above. If your final address differs, run:

```text
node tools/configure-domain.cjs https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/
```

Include the trailing slash and repository path. For a custom domain, pass its full HTTPS address instead. This command updates metadata only; it does not deploy or configure DNS.

## Contact form

The form validates an inquiry and prepares an email draft for the visitor's email application. It does not send mail directly or store submissions. Email and WhatsApp links work independently.

## Export notes

Source snapshot: 337864c07b058cbd8a1d9d29279973e02adc2772. This export puts the website directly at the repository root, updates export-only hosting metadata and includes all assets used by the current website. Sites-specific hosting configuration, Git history, temporary files and credentials are excluded. The existing hosted website is unchanged.
