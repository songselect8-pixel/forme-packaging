# Product imagery revision — 11 November 2026

Latest follow-up: the user paused the richer full-color print revision after six reviewed scenes. The new hero, separate centered showcase, p61, p62, p67 and p73 are applied locally; fourteen planned revisions keep their existing website photos and are marked paused in the shared registry. The homepage is now a full-bleed static photograph, and the separate film starts with the centered showcase. Current scope and SEO validation are recorded in `docs/seo-audit.md`; the 79-image completion notes below describe the preceding completed run.

The catalog has 78 individually briefed products and a separate homepage collection hero. All 79 scenes were regenerated sequentially with the built-in GPT ImageGen tool, visually reviewed one at a time, and replaced in the local website. Original artwork and a consistent warm studio backdrop are used. No competitor photography or video footage is included.

## Structural references consulted in the October research

- FEFCO design code: https://www.fefco.org/technical-information/fefco-code
- The Box Factory, illustrated 0201 and 0427 structures: https://www.boxfactory.co.uk/fefco-box-designs/all-styles
- PakFactory folding-carton style library: https://pakfactory.com/folding-carton-paperboard-boxes.html
- Packhelp shipping-box construction and materials: https://packhelp.com/help/topics/shipping-boxes/
- TWO Packaging rigid-box construction library: https://www.twopackaging.com/custom-rigid-boxes/

Google Images was attempted in Playwright but returned an access-verification / HTTP 429 page. Structural research continued on the primary sources above. The unobstructed manufacturer diagram capture is saved locally at `output/reference/corrugated-structure-0201-0427.png` for internal comparison only.

## Review rules

- Magnetic: one connected cover, real rear hinge, aligned front closure and four continuous base walls.
- Lid/base: one separate lid that can telescope over a matching base.
- Drawer: one tray and one sleeve on the same straight axis; no unrelated lid.
- Corrugated shipping carton: four top flaps, plausible center closure and visible layered cut edges.
- Corrugated mailer: connected rear lid, side flaps, folded sidewalls and a plausible front closure.
- White card: thin solid-card edges, creased panels, tuck flap and dust flaps; no corrugated or rigid-board walls.
- Cylinders and shaped boxes: matching lid/base contours and consistent geometry.
- Inserts: products fit their recesses; accessories and dividers remain inside the base.
- Calendars: drawers fit their frame; doors attach to the cabinet; no floating or duplicated components.

The complete prompt set and authoritative progress record is `docs/product-image-prompts.json`. Each scene includes its selected native PNG path, review/export status, previous SHA-256 and new SHA-256. Final website photos are `dist/assets/hero.webp` and `p01.webp` through `p78.webp`; 28 existing shared image names are refreshed from those approved outputs so homepage, industry and article references stay current. Full-resolution masters for this run remain in the Codex-managed local generation directory; the earlier `output/structure-originals/` contains old drafts and is not the current delivery.

The green and pink collapsible boxes show erected geometry with diagonal corner folds. The pyramid is a closed square-base structure. The two-door calendar uses continuous paper-wrapped cover spines without metal hinges. The vial insert description was updated to match six product-shaped EVA recesses in the new photograph.

The existing 12-second film was rebuilt from the new hero, p61, p67 and p73 at 1280×720 / 30 fps H.264, and its captions now describe these scenes. All 79 independent WebP files are distinct, differ from their previous versions and match the recorded hashes; all 28 shared filenames match their current source photo. The 79 files are 1536×1024 and total 10.81 MiB. The local build and all 5 automated tests pass.

Playwright checks pass for 74 landscape card measurements and desktop/mobile detail-image proportions, including the elongated gift box and white-card carton. Six representative homepage/catalog/series/article routes were checked at both 1440px and 390px with no broken source images or horizontal overflow. The article lead image remains 320×212 on desktop and at most 205px high on mobile.

Catalog photographs now use their native 3:2 ratio with contain fitting and no hover enlargement, preventing close-framed lids from being clipped. The independent headless Chrome check in `tools/check-product-hero-layout.js` passes all 78 catalog photographs at both widths, before and during hover, plus detail proportions and new-film playback. Latest desktop and mobile review captures are `output/playwright/image-refresh-desktop.png` and `image-refresh-mobile.png`. Browser scratch logs and previous drafts are retained; no cleanup was performed.

These are concept images, with final production construction and material confirmed through physical sampling.
