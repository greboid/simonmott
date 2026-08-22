# simonmott.co.uk — Hugo copy

Static copy of https://www.simonmott.co.uk/ rebuilt with Hugo, using a
re-implementation of the WordPress "treeson" theme layout and all 28 posts
scraped from the live site (content and media downloaded as-is).

## Layout

- `content/post/` — the 28 posts (raw HTML bodies, WordPress URLs preserved
  via `url` front matter so permalinks like `/2026/08/.../` keep working)
- `content/archives/` — monthly/yearly archive pages (`/2026/08/`, `/2024/`)
- `content/search/` — static search page (client-side, backed by `search.json`)
- `themes/treeson/` — the theme: templates replicating the original markup,
  plus the original CSS/fonts downloaded from the live site
- `static/wp-content/uploads/` — all post images at their original paths
- `Dockerfile` / `nginx.conf` — multi-stage build: Hugo renders the site,
  nginx serves it (with the custom 404 page and `/feed/` → `/index.xml`)

## Theme assets

- CSS/JS live in `themes/treeson/assets/` and are processed by Hugo's
  asset pipeline: the stylesheets are concatenated into a single bundle,
  and everything is minified and content-hashed for production builds
  (plain files for `hugo server`). nginx caches `/css/` and `/js/`
  immutably.
- The original jQuery / Bootstrap-JS / prettyPhoto stack is gone. Theme
  behaviour (parallax header, mobile menus, search box hint, dark-mode
  toggle) is a small vanilla-JS port in `assets/js/site.js`.
- `prettify.js` (code highlighting) is only loaded on pages that contain
  code blocks.
- `search.json` is generated from the posts at build time (see
  `layouts/home.searchindex.json`), so it always stays in sync.

## Run locally

    hugo server

or

    docker build -t simonmott-hugo .
    docker run -p 8080:80 simonmott-hugo

## Notes

- Taxonomy URLs match WordPress: `/category/<slug>/` and `/tag/<slug>/`
  (Hugo's default `/categories/...` paths are emitted as aliases).
- The WordPress search endpoint doesn't exist on a static site; the search
  box submits to `/search/` which runs a small client-side search over
  `search.json`.
- Excerpts and "Read More" links on listing pages are reproduced using
  Hugo's `<!--more-->` summary divider.
- `public/` is build output — untracked (see `.gitignore`); the Docker
  image builds it from scratch.
