# Images Directory

Place the following images in this folder:

| File | Size | Description |
|------|------|-------------|
| `logo.png` | ~200×60px | Main site logo (transparent PNG) |
| `logo-white.png` | ~200×60px | White version for footer |
| `favicon.ico` | 32×32px | Browser favicon |
| `favicon-192.png` | 192×192px | PWA / Android icon |
| `favicon-512.png` | 512×512px | PWA splash icon |
| `hero-bg.jpg` | 1920×1080px | Hero background (compressed ≤200KB) |
| `og-image.jpg` | 1200×630px | Social share preview image |
| `about-team.jpg` | 900×600px | Team / office photo for About section |
| `client-1.png` – `client-8.png` | ~180×60px | Client logo images (marquee) |

## Guidelines
- Compress all images with [Squoosh](https://squoosh.app) or [TinyPNG](https://tinypng.com)
- Use WebP where possible for best Page Speed scores
- Hero background should be dark or use a CSS overlay (already applied in CSS)
- All `<img>` tags in templates already include `loading="lazy"` and `onerror` fallbacks
