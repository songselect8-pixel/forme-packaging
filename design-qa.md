# Design QA — current revision

The reference-based navigation, original homepage module order, product card format and current ivory/forest-green theme are preserved. The user explicitly authorized a new article layout and requested three additional printed-packaging series.

## Imagery

All 78 product entries now have distinct generated photos matched to their own construction and application. Every selected image was visually inspected in local contact sheets, with full-size checks for representative constructions and corrections. Shipping cases show four flaps; die-cut mailers show connected lids and folding sidewalls; white-card cartons show solid thin paperboard and tuck/dust flaps. Drawer, lift-off, shaped and calendar formats were checked separately. Product material and insert descriptions were corrected alongside the photos.

The elongated ribbon-handle box was regenerated with a shallow cap and lower handle fixing points. A further targeted edit removed an impossible interior handle. The selected image has a continuous empty interior and a clear lid-seating area. These remain design concepts; production details are confirmed by physical samples.

## Layout and content

The homepage and catalog include the three printed series. Each series has six application products, a structure/material overview, specification checks, a buyer guide and a production workflow. Six cards use three desktop columns and one mobile column, with two at intermediate widths. Shared navigation, footer, industry recommendations, resources and quote selections include the new ranges.

Fourteen articles now have topic-specific original copy, useful checks and comparisons. The lead image is 320×212px on desktop and at most 340×205px on mobile. The main text column is constrained to 750px; the contents sidebar remains separate on desktop. Desktop and mobile article screenshots were inspected for hierarchy, line length, image scale and overflow.

## Verification

Five Node checks pass, including the entire route/media/anchor graph. The Playwright workflow passes with zero application exceptions. Eleven representative mobile routes have no horizontal overflow. New-series filters, query prefill and estimator transfer pass; original inquiry, draft, attachment, download and FAQ interactions still pass. All homepage product images decode and the replacement film plays.

Current screenshots are in `output/playwright/`. Original same-viewport reference comparisons are retained in `output/comparison/`; palette, original imagery, added product series and revised editorial layout are intentional user-authorized differences.

Final visual correction: new series-card images inherited the HTML height attribute until explicit `height:auto` was added. The shared component now keeps a 3:2 ratio on every page; 8 desktop/mobile checks pass. All 28 article layouts pass. Final captures await image decoding to avoid recording asynchronous paint placeholders.
