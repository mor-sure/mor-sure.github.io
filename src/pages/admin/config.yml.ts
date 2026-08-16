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
      - name: type
        label: Type
        widget: select
        options: [print, online, event, record]
        default: print
        hint: >-
          Print = a scanned object at its real proportions. Online = a
          title-link, nothing else shown. Event = a real-size cover followed
          by a swipeable set of photos, each shown uncropped at its own
          shape. Record = two images (front/back) shown one at a time, both
          at real proportions. Only fill in the fields below that match the
          type you pick.
      - { name: title, label: Title, widget: string }
      - name: date
        label: Date
        widget: datetime
        format: 'YYYY-MM'
        date_format: 'YYYY-MM'
        time_format: false
        hint: Utilisée pour trier les projets (plus récent en premier) et affichée devant le titre.
      - name: caption
        label: Caption
        widget: text
        required: false
        hint: 'Print/Event/Record: shown under the title. Online: unused for display.'
      - name: width_mm
        label: 'Print/Event/Record only — cover width (mm)'
        widget: number
        value_type: int
        min: 1
        required: false
        hint: Real width of the cover/sleeve. Sets its proportions inside the frame.
      - name: height_mm
        label: 'Print/Event/Record only — cover height (mm)'
        widget: number
        value_type: int
        min: 1
        required: false
      - name: images
        label: 'Print/Record only — images'
        label_singular: Image
        widget: list
        required: false
        summary: '{{fields.src}}'
        hint: >-
          Print: first image is the cover (real size), rest are spreads.
          Record: exactly 2 images (front/back), both real size.
        fields:
          - { name: src, label: Scan, widget: image }
          - { name: alt, label: Alt text, widget: string, required: false }
      - name: event_images
        label: 'Event only — images'
        label_singular: Photo
        widget: list
        required: false
        summary: '{{fields.src}}'
        hint: First image is the cover (real size). Add a credit per photo — it displays over that image.
        fields:
          - { name: src, label: Photo, widget: image }
          - { name: alt, label: Alt text, widget: string, required: false }
          - { name: credit, label: Credit, widget: string, required: false, hint: 'e.g. "Photo: Andrew White"' }
      - name: url
        label: 'Online only — link'
        widget: string
        required: false
        hint: Where the "Online" tag links out to.
      - name: image
        label: 'Online only — hero image'
        widget: image
        required: false
        hint: Optional — used only for social-preview cards, not shown on the site.
      - name: alt
        label: 'Online only — hero alt text'
        widget: string
        required: false
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
            hint: Leave a blank line between paragraphs. HTML tags like <i>…</i> are allowed.
          - name: photo
            label: About photo
            widget: image
            required: false
            # Absolute src/ path: index.astro globs this folder so the photo
            # is optimised like the scans are.
            media_folder: /src/assets/uploads
            public_folder: /src/assets/uploads
          - name: photo_credit
            label: Photo credit
            widget: string
            required: false
`;

export const GET: APIRoute = () =>
  new Response(CONFIG, { headers: { 'Content-Type': 'text/yaml; charset=utf-8' } });
