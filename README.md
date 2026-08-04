# Tetsugo To — Personal Website

A bilingual personal portfolio built with Next.js and exported as a static site for GitHub Pages.

## Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000/en](http://localhost:3000/en) or
[http://localhost:3000/ja](http://localhost:3000/ja).

Works are defined in `data/works.yaml`. Link preview images are fetched at build time and cached in `data/works-preview.json`.

## Build

```bash
pnpm build
```

The static site is written to `out/`. The root page redirects to English by default.

## Deployment

Pushes to `main` run `.github/workflows/deploy-pages.yml`, build the static export, and publish `out/` to GitHub Pages.
