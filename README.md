# Martin Sigler — portfolio

Astro static site + [Decap CMS](https://decapcms.org/), deployed to GitHub Pages
by `.github/workflows/deploy.yml` on every push to `main`.

## The idea

Every work sits in an identically sized box, and how much of that box it fills
comes from the **real size of the printed object in millimetres**. A booklet
reads as small, an A4 magazine as bigger, a spread fills the box. That
relationship is the design, so the millimetre figures are content, not styling.

`src/lib/scale.ts` owns it. The largest work in the collection defines one
millimetre in screen pixels; every other work is measured with that same
millimetre. Add a bigger work and everything rescales together — nothing is
hardcoded per work.

Two knobs, both at the top of that file: `CONTENT_WIDTH` (px the widest work
occupies) and `BOX_PADDING` (breathing room inside the box). `PAGE_WIDTH`
derives from them and is the measure the header, boxes, captions and about text
all share, so one left edge runs down the page.

## Structure

```
src/lib/scale.ts                 the scale system
src/components/Work.astro        box + looping carousel + caption
src/pages/index.astro            works, ordered
src/pages/about.astro            about text, contact, photo
src/pages/admin/index.astro      Decap CMS entry point
src/pages/admin/config.yml.ts    Decap config (generated — see below)
src/layouts/Base.astro           html shell, header, meta
src/styles/global.css            all the styling
src/content/works/*.md           one file per work (CMS-managed)
src/data/site.json               name, contact, about text (CMS-managed)
src/assets/works/                scans (CMS-managed)
src/assets/uploads/              about photo (CMS-managed)
```

Images live under `src/`, not `public/`, so Astro optimises them into AVIF/WebP
at 1× and 2×. Anything in `public/` is copied verbatim and skips that.

## Local development

```sh
npm install
npm run dev      # site at http://localhost:4321
```

To edit content through the CMS UI, run this in a second terminal:

```sh
npm run cms      # decap-server proxy on :8081
```

Then open http://localhost:4321/admin/ — no login needed; it writes straight to
the files on disk and the site hot-reloads.

`npm run check` runs `astro check`; `npm run build` runs it first and fails the
build on type errors.

## The CMS config is generated

`src/pages/admin/config.yml.ts` emits `/admin/config.yml` at build time so that
`local_backend: true` appears **only in dev**. Shipped to production it makes the
browser probe `localhost:8081`, and if the editor happens to be running
`npm run cms`, the live `/admin/` silently attaches to their local filesystem
instead of GitHub. Edit the config in that file, not in `public/`.

## Enabling the CMS in production

The GitHub backend needs a small server to exchange the OAuth code for a token —
GitHub's token endpoint sends no CORS headers, so a static site cannot complete
the handshake alone (this is also why the device flow doesn't help). Deploy a
tiny OAuth proxy, e.g. a Cloudflare Worker, then uncomment `base_url` and
`auth_endpoint` in the config.

Until then, edit locally as above or commit changes directly.

## Adding a work by hand

`src/content/works/my-work.md`:

```md
---
title: My Work
caption: My Work, one sentence about it.
width_mm: 230        # real size of the object; spreads measured opened flat
height_mm: 300
images:
  - src: ../../assets/works/my-work.jpg
    alt: My Work, cover
  # a slide of a different physical size overrides the work's default:
  - src: ../../assets/works/my-work-spread.jpg
    width_mm: 460
    height_mm: 300
order: 10            # leave gaps so works can be inserted later
draft: false
---
```

Two or more images give the work a looping carousel with arrows and a counter.

### Preparing scans

Crop tight to the object — no white margins, since the box supplies the space.
Export everything at one constant resolution (200 dpi works well), sRGB, 8-bit,
JPEG q92, long edge capped around 3200px. Constant dpi means pixel size tracks
physical size, so detail per millimetre stays even across works.

The build warns when a scan's proportions disagree with its stated millimetres by
more than 3% — usually a typo, swapped width/height, or an uncropped scan.
Display is never distorted; the object just isn't the size claimed.

## Custom domain

Not currently configured. To enable: add `public/CNAME` containing the domain,
set `site` in `astro.config.mjs` to match, and point DNS at GitHub Pages. Both
must change together or canonical and social URLs will reference the wrong host.
