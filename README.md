# Portfolio

Astro static site + [Decap CMS](https://decapcms.org/), deployed to GitHub Pages
by `.github/workflows/deploy.yml` on every push to `main`.

## Structure

```
src/pages/index.astro            home page (intro + project list)
src/pages/projects/[...slug].astro   one page per project
src/layouts/Base.astro           html shell, header, footer
src/styles/global.css            all the styling
src/content/projects/*.md        project entries (CMS-managed)
src/data/site.json               name, tagline, about, links (CMS-managed)
public/admin/                    Decap CMS (index.html + config.yml)
public/uploads/                  images uploaded via the CMS
```

## Local development

```sh
npm install
npm run dev      # site at http://localhost:4321
```

To edit content locally through the CMS UI, run this in a second terminal:

```sh
npm run cms      # decap-server proxy on :8081
```

Then open http://localhost:4321/admin/ — `local_backend: true` makes it write
straight to the files on disk, no login needed.

## Enabling the CMS in production

`public/admin/config.yml` uses the GitHub backend, which needs a tiny OAuth
server to trade the login code for a token (GitHub has no browser-only flow).
Deploy one — e.g. [decap-oauth on Cloudflare Workers](https://github.com/i40west/netlify-cms-cloudflare-pages)
or a Netlify site with Identity — create a GitHub OAuth app pointing at it, then
uncomment `base_url` / `auth_endpoint` in the config.

Until that's set up, edit content locally (above) or straight in the repo.

## Adding a project by hand

Create `src/content/projects/my-project.md`:

```md
---
title: My Project
description: One line about it.
date: 2026-08-04
cover: /uploads/photo.jpg   # optional
link: https://example.com   # optional
draft: false
---

Markdown body.
```
