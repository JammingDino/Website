# Levi Pronk-Jones — Portfolio

An awwwards-style personal portfolio for **Levi Pronk-Jones**, a software engineer based in Christchurch, NZ. Built from scratch with plain HTML, CSS, and JavaScript — no build step, GitHub Pages friendly.

## Design

A near-monochrome dark "ink" theme with a single molten-orange accent (`#ff4d00`). Type is set in Space Grotesk (display), Inter (body), and JetBrains Mono (labels). The site features a custom cursor, an animated mesh-canvas hero, a film-grain overlay, scroll-reveal animations, and a shared media-preview modal for project case studies.

## Sections

- **Hero** — animated canvas backdrop and intro
- **Selected Work** — three feature projects (Chemistry Simulator, Minecraft Mods, MultiZone) that open a detail modal
- **The Lab** — smaller experiments and open-source builds
- **About** — capabilities, toolkit, and stats
- **Contact** — email and social links

## Structure

```
index.html    # Markup and project content (data-* attributes drive the modal)
style.css     # Theme tokens, layout, and animations
script.js     # Preloader, cursor, mesh canvas, scroll reveals, modal
assets/       # Project imagery (PNG/JPG screenshots + SVG posters)
```

## Running locally

It's a static site — open `index.html` directly, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

Add `?instant` to the URL to skip the preloader and reveal all sections immediately (handy for development).

## License

See [LICENSE](LICENSE).
