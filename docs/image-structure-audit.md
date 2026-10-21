# Product imagery revision — 21 October 2026

The catalog now has 78 individually briefed products. Images are generated with the built-in ImageGen tool, using original artwork and a consistent warm studio backdrop. No competitor photography or video footage is included.

## Structural references consulted

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

The complete per-product prompt set is `docs/product-image-prompts.json`. Final website photos are `dist/assets/p01.webp` through `p78.webp`; shared homepage and industry image names are refreshed from those same approved outputs. Full-resolution selected masters remain in `output/structure-originals/`. These are concept images, with final production construction and material confirmed through physical sampling.
