# Reference-structure rebuild — 2026-10-21

The user clarified that the reference site's navigation, module sequence, catalog depth, page layouts and content topics should be retained. The authorized changes are visual style, original product images/videos, modest copy edits and company/contact replacement. The previous editorial showroom was outside that intent and has been replaced.

Reference captured with Playwright at 1440×1000 and 390×844, including desktop/mobile navigation, homepage, first product rows, process, quote form, product detail, industry directory, catalog and the quote-page estimator. Raw HTML is retained only as local analysis material in ignored `output/reference/`; competitor media, contact destinations, trackers and structured company claims are not shipped.

The homepage keeps its original order: video hero, process/video teaser, statistics, supplier profile, price/MOQ table, category wall, 60-product showcase, finishing, comparison, unboxing, advantages, certification records, process, knowledge questions, testimonials, product questions, blog, short FAQ, inquiry, buyer resources, footer and fixed contact controls.

Scope: 60 product details, 15 industry details, directory pages, cases, certifications, about, production overview, 11 blog guides, seven buyer resources, quote, privacy and support. 104 substantive pages; 14 legacy redirects.

Visual changes: warm paper/white surfaces, forest-green accents, champagne hero buttons and local Manrope type. Preserve the 68px desktop navigation, full-height homepage hero, four-column homepage product grid, three-column catalog, two-column product hero and quote/estimator page. Mobile uses the corresponding single-column layouts and original navigation hierarchy.

29 generated images and one original still-based MP4 replace reference media. Company performance figures, certifications, reviews, location, contacts, MOQ and lead times require owner information. These remain explicit placeholders or project-specific fields in their existing module positions. The price estimator is an illustrative planning comparison.

Frontend-only inquiry: required validation, local attachment selection, file-size check, NDA request, explicit local draft persistence and downloadable text brief. No external transmission occurs until actual contact services are configured. Accessibility includes native forms/dialogs, keyboard navigation, accordion states, reduced motion and video controls.


## 2026-11-14 — Packaging collection hero

The requested homepage poster now uses a bright editorial split composition: dark green copy on warm paper, beside a complete photograph of printed packaging samples. The photo shows a corrugated shipping carton, mailer, rigid gift box and two folding cartons without cropping or text overlays. On phones the photograph follows the copy. The rest of the page structure is retained.

Research: the Google search page returned HTTP 429; use direct peer sites and the web search results instead. PakFactory's homepage was visually inspected at 1440×1000 (https://pakfactory.com/). Its clear separation of copy from an assortment of printed packaging informed the hierarchy, shorter copy and complete silhouettes. PackMojo (https://packmojo.com/) and Packhelp (https://packhelp.com/) were also read for their packaging range and product terminology; their visual layouts were not verified. The saved hero inspiration library (https://supahero.io/) was consulted as a layout reference, without copying an individual design. No competitor artwork or photos are used.

One original hero was generated with the built-in GPT image tool, then edited to remove unverified certification claims from tiny sample print. Final asset: `dist/assets/hero.webp`, 1536×1024. The generation prompt, correction prompt, source paths and hashes are in `docs/product-image-prompts.json`. Previous hero versions remain recoverable through Git and the existing source references. The other 14 product image replacements remain paused.

Verification: `npm run build`, `npm test`, and `tools/check-home-hero.js` in a headless Chrome browser. The browser check covers 320–2560px widths, image proportions, separate copy/image regions, overflow and both hero buttons. Screenshots are kept in ignored `output/playwright/hero-refresh-desktop.png` and `hero-refresh-mobile.png`.
