# Local layout repair

- Reproduced landscape thumbnails at 404x1024 on desktop and 341x1024 on mobile. HTML intrinsic height attributes remained definite because the shared stylesheet lacked a responsive image height default.
- Added the shared `img { max-width:100%; height:auto }` default. Existing component frames retain their explicit sizing. The regression check now passes 74 image measurements across homepage unboxing/blog, the article index and the industry index.
- Product detail photos used a square cover crop that removed ends from elongated boxes. They now use their native 3:2 ratio with contain fitting. The four specification fields form one row on wide screens and two rows on narrower screens. Desktop/mobile regression checks pass for long-box and white-card details.
- Crawled all 131 pages at 1440px and 390px. No horizontal overflow or unexpectedly tall content images were found; the mobile full-height hero background is intentional.
- Added Start-Local.ps1 and the parent-folder one-click Windows launcher. Both fresh startup and reuse were verified. The server listens on 127.0.0.1:4173 and runs as a hidden background process. Images, video, fonts, scripts and styles load from local files.
- Five existing Node checks pass. Screenshots and the layout audit are retained in output/playwright/.
