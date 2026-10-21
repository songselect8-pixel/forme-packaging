# Reference parity implementation

- [x] Capture source desktop/mobile screens, source DOM structures and the main interactions using Playwright.
- [x] Rebuild the original navigation, homepage module order, 60 product slots and corresponding route structure.
- [x] Add original images for specialized box structures, seasonal calendars, gifting sets and category applications.
- [x] Restore the catalog filters, industry directory, product details, planning calculator, structured quote form and supporting pages.
- [x] Verify the full static route/media graph and core logic with Node; test actual desktop/mobile flows with Playwright.
- [x] Fix the observed mobile contrast and checkbox overflow issues; compare revised screenshots against source captures at identical viewports.
- [x] Prepare the verified source for packaging on the existing owner-private Site. Publication outcome is recorded by the native Sites tools.

Main files: `build.mjs`, `dist/site-config.js`, `dist/catalog-data.js`, `dist/reference-layout.css`, `dist/styles.css`, `dist/app.js`, `serve.mjs`, `test/site.test.mjs`.

Original source analysis, generated-image masters, browser downloads and comparison images are excluded from publication. The deployed static assets are local and self-contained.
