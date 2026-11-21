# Website screenshot previews

Edurise Global and Doctor Portfolio now use actual website captures supplied by the owner as PDFs. Each PDF was rendered, its print margins removed, and its consecutive pages joined in order. The final assets are optimized WebP images with a width of 1122 pixels. Source PDFs are not deployed.

- `assets/projects/edurise-full.webp`: 1122 x 6333 pixels
- `assets/projects/doctor-full.webp`: 1122 x 5670 pixels
- `assets/projects/stemwave-full.webp`: 1122 x 4525 pixels
- `assets/projects/evonacart-full.webp`: 1122 x 3460 pixels

Evonacart is a WordPress storefront showcase after StemWave. It reverses the desktop composition, with text left and screenshot right; the screenshot comes first on mobile. A warm orange accent follows the supplied storefront's branding. It appears under both Websites and the additional WordPress filter. WordPress is confirmed by the owner; no commerce plugin, checkout implementation or sales outcomes are assumed.

StemWave Therapy is presented after the two website cards as a wide landing-page showcase: screenshot on the left and project context on the right, stacked on small screens. It belongs to the Websites filter and includes English/Bangla project details. Descriptions are based on the supplied design; no conversion results or implementation technology are claimed.

`js/website-previews.js` controls pointer-hover scrolling and reset, the play/reset button, mobile image taps, keyboard controls and reduced motion. Animation runs only while the preview is active and visible. Leaving the card with the mouse, moving keyboard focus outside it, pressing Escape, or leaving the viewport resets it.

With reduced motion enabled, the button opens a manually scrollable image instead of starting animation. English and Bangla control labels are included. The Job Tracking gallery is independent and still awaits its screenshots.
