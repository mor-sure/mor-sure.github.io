import type { APIRoute } from 'astro';

/**
 * Decap's config is generated rather than served from public/ so that
 * `local_backend` is only ever present in dev. Shipped to production it makes
 * the browser probe localhost:8081, and if the editor happens to be running
 * `npm run cms` at the time, the live /admin/ silently attaches to their local
 * filesystem instead of GitHub.
 */
const LOCAL_BACKEND = `
# Lets \`npm run cms\` + \`npm run dev\` edit local files with no login.
# Dev only — never emitted in a production build.
local_backend: true
`;

const CONFIG = `backend:
  name: github
  repo: mor-sure/mor-sure.github.io
  branch: main
  base_url: https://decap-auth.bfqyptmpb8.workers.dev
  auth_endpoint: auth
${import.meta.env.DEV ? LOCAL_BACKEND : ''}
# Scans live in src/ so Astro can optimise them. public_folder is relative
# because it is written into frontmatter, and Astro resolves image paths from
# the markdown file's own location (src/content/works/).
media_folder: src/assets/works
public_folder: ../../assets/works

collections:
  - name: works
    label: Works
    label_singular: Work
    folder: src/content/works
    create: true
    slug: '{{slug}}'
    extension: md
    format: frontmatter
    sortable_fields: [order, title]
    summary: '{{order}} — {{title}}'
    fields:
      - { name: title, label: Title, widget: string }
      - name: caption
        label: Caption
        widget: text
        hint: Shown under the box. Title, then a sentence or two.
      - name: width_mm
        label: Cover width (mm)
        widget: number
        value_type: int
        min: 1
        hint: Real width of the cover (first image). Sets its proportions inside the frame.
      - name: height_mm
        label: Cover height (mm)
        widget: number
        value_type: int
        min: 1
      - name: images
        label: Images
        label_singular: Image
        widget: list
        summary: '{{fields.src}}'
        hint: First image is the cover, shown at its real proportions. The rest are spreads, scaled to fit the frame.
        fields:
          - { name: src, label: Scan, widget: image }
          - { name: alt, label: Alt text, widget: string, required: false }
      - name: order
        label: Order
        widget: number
        value_type: int
        default: 0
        hint: Lower numbers appear first. Leave gaps of 10 so works can be inserted.
      - { name: draft, label: Draft, widget: boolean, default: false }

  - name: settings
    label: Site & About
    files:
      - name: site
        label: Site & About
        file: src/data/site.json
        fields:
          - { name: name, label: Name, widget: string }
          - { name: tagline, label: Tagline, widget: string, hint: Used for search results only. }
          - { name: email, label: Email, widget: string }
          - { name: instagram, label: Instagram handle, widget: string }
          - { name: instagram_url, label: Instagram URL, widget: string }
          - name: about
            label: About text
            widget: text
            hint: Leave a blank line between paragraphs.
          - name: photo
            label: About photo
            widget: image
            required: false
            # Absolute src/ path: about.astro globs this folder so the photo is
            # optimised like the scans are.
            media_folder: /src/assets/uploads
            public_folder: /src/assets/uploads
`;

export const GET: APIRoute = () =>
  new Response(CONFIG, { headers: { 'Content-Type': 'text/yaml; charset=utf-8' } });
