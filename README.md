# Levi Pronk-Jones — Portfolio

An awwwards-style personal portfolio for **Levi Pronk-Jones**, a software engineer based in Christchurch, NZ. Built from scratch with plain HTML, CSS, and JavaScript — no build step, GitHub Pages friendly.

## Design

A near-monochrome dark "ink" theme with a single molten-orange accent (`#ff4d00`). Type is set in Space Grotesk (display), Inter (body), and JetBrains Mono (labels). The site features a custom cursor, an animated mesh-canvas hero, a film-grain overlay, scroll-reveal animations, and a shared media-preview modal for project case studies.

## Sections

- **Hero** — animated canvas backdrop and intro
- **Selected Work** — four feature projects (MultiZone, Chemistry Simulator, Minecraft Mods, MTG Proxy Maker) that open a detail modal
- **Experience** — industry and client engagements (AEC Electronics, Holmes Solutions)
- **The Lab** — smaller experiments and open-source builds
- **About** — bio, capabilities, toolkit, and stats
- **Contact** — email and social links

## Project modals

Any `.project__inner` or `.lab-card` carrying `data-title` opens the shared modal.
The modal is populated from that element's dataset:

| Attribute        | Format                                      |
| ---------------- | ------------------------------------------- |
| `data-media`     | single hero image (ignored if `data-gallery` is set) |
| `data-desc`      | lead paragraph                              |
| `data-highlights`| `\|`-separated bullets                       |
| `data-gallery`   | `Caption::src \| Caption::src` — captioned figures |
| `data-tags`      | comma-separated                             |
| `data-note`      | closing line for credits, caveats, availability |
| `data-links`     | `Label::url \| Label::url`                   |

## Structure

```
index.html         # Markup and project content (data-* attributes drive the modal)
style.css          # Theme tokens, layout, and animations
script.js          # Preloader, cursor, mesh canvas, scroll reveals, modal, live stats
assets/            # Project imagery (PNG/JPG screenshots + SVG posters)
assets/stats.json  # Download totals (see "Mod download counter" below)
```

## Mod download counter

The "Mod downloads" stat and the Minecraft card's figure are populated on page
load. **Modrinth** exposes an open-CORS public API, so its total is fetched live
in the browser from `api.modrinth.com`. **CurseForge** is behind Cloudflare and a
keyed API with no browser CORS, so it can't be scraped client-side — its total is
stored in [`assets/stats.json`](assets/stats.json) and summed with the live
Modrinth count.

To keep it current, edit `curseforge` in `assets/stats.json` with the combined
total from your CurseForge dashboard. (To fully automate it you'd add a scheduled
GitHub Action that calls the CurseForge API with a `CURSEFORGE_API_KEY` secret and
commits the updated JSON — not wired up yet.)

The "Public repos" stat works the same way: GitHub's REST API is open-CORS, so the
real figure is fetched live from `api.github.com/users/JammingDino`. The
`data-count` value in the markup is only the offline fallback.

## Running locally

It's a static site — open `index.html` directly, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

Add `?instant` to the URL to skip the preloader and reveal all sections immediately (handy for development).

## License

See [LICENSE](LICENSE).
