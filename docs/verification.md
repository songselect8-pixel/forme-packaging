# Verification — reference rebuild, 2026-10-21

`npm run build` generated 104 substantive pages, 60 independent product details, sitemap, robots and 14 old-link redirects.

`npm test`: four passing checks cover product route/category integrity, planning price calculation and invalid-input handling, inquiry brief content, all local page/media/anchor links, exclusion of reference contacts/trackers, and homepage section/product completeness.

Playwright uses an isolated Chrome session, with source captures at 1440×1000 and 390×844. Browser checks cover desktop dropdowns, mobile menu, catalog filters, product navigation, image enlargement, product-to-quote prefill, calculator changes and transfer to the form, attachment selection, draft persistence/clear, NDA and consent, requirement validation, brief download, FAQ expansion and the original film's actual playback.

The initially observed mobile hero overlay contrast issue was traced to an inherited `!important` rule. The quote-page overflow came from the inherited global `input { width:100% }` applying to checkboxes. Both were fixed at their shared selectors and checked again. A filter test race was resolved by awaiting the destination page's module/network load before clicking; the actual filter correctly returns two bag products.

Browser checks passed with no application exceptions and no horizontal overflow at 390px on home, catalog, product detail, industries, quote and a guide. All homepage product images were decoded before capture. Same-viewport source/implementation comparison sheets are in `output/comparison/`.

Company-specific business data remains pending. The original reference media and its analytics/form/WhatsApp destinations are excluded. The product film is an original 12-second generated-photo montage, not factory footage.
