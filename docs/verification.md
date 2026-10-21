# Verification — 2026-10-21

- `npm run build`: 15 complete static HTML pages, sitemap and robots.txt.
- `npm test`: 3 passing checks covering catalog families, inquiry brief integrity, and all internal file/anchor references across 15 pages.
- Browser at 1440px: complete homepage visually inspected, original product images decoded, no horizontal overflow or broken images.
- Browser at 390px / 375px: homepage, collection filter, product page, contact, bespoke and guide pages checked without horizontal overflow. Mobile menu opens and navigates.
- Catalog “Paper bags” filter: 1 visible matching product; category stored in URL.
- Product → inquiry: selected product prefilled correctly; required fields invalid until supplied.
- Inquiry: valid test brief opens as text in a native dialog, download action works; it explicitly states not sent. Local draft save/clear and privacy consent checked. Test draft cleared.
- FAQ opens. Original film plays with readyState 4, duration 12s, width 1280; closing dialog pauses playback.
- Video inspected with ffprobe: H.264, 1280×720, 12.000 seconds.
- Font file signatures checked and matching TrueType names, CSS format declarations and licenses supplied.
- A browser extension produced an unrelated message-port error. No application exception or failed application media was found.

Screenshots are local in `output/playwright/`. Company facts, contact details and final product specifications await the owner's input; the website clearly treats generated product images as concepts and does not simulate delivery of an inquiry.
