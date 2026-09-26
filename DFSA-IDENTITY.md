# DFSA — Dryland Forest Support Accelerator

This design project holds the DFSA: FAO's Dryland Forest Support Accelerator. It contains
(a) the DFSA advocacy products (DFSA Campaign, Call to Action on Dryland Forests,
CBD side event, COFO WG collateral, COP30 Roadmap contribution, Finance Tracker), and
(b) the **DFSA platform** in `DRIP/` — the former DRIP site being converted into the
Accelerator's knowledge platform. Content is retained; the design is being revised.

## Temporary visual identity (interim)

The DFSA does not yet have its own design language. Until it does, the project runs on a
**temporary identity adopted from the DSL-IP system** — do not present it as final.

- **Foundation tokens** live in `colors_and_type.css` (root) and `DRIP/colors_and_type.css`:
  cream paper `#F5F2E8`, ink `#241F1B`, forest `#477E59`, clay `#CF715D`/`#B4543F`,
  amber `#F8B133`; display face DermawanRough (Oswald fallback), Merriweather serif body,
  Poppins sans for UI/labels.
- **DFSA marks**: wordmark `DFSA` + amber dot (`DFSA<span>.</span>`); subtitle
  "Dryland Forest Support Accelerator".
- **DFSA accent**: the platform top bar is deep clay `#6E3B2C` (the DSL-IP forest green
  `#1f523a` is retired for platform chrome); amber stays the highlight colour.
- When the real DFSA identity is defined, swap the tokens in `colors_and_type.css` once —
  pages consume variables, not hard-coded colours (legacy pages with inline palettes are
  being migrated as they are revised).

## Conversion rules (DRIP → DFSA)

- **File names are DFSA too** (renamed 2026-09-26): the manual series is
  `DFSA Manual *.html`, the summary is `DFSA Summary.html`, and the shared assets are
  `dfsa-*.js` / `dfsa-*.css` (CSS classes follow: `.dfsa-topbar`). Never reintroduce
  `drip-`/`DRIP `/`DFSM ` file names; any rename must update every reference in the
  same pass and be link-checked.
- **Visible brand text is always DFSA** — never reintroduce "DRIP",
  "Dryland Research & Information Platform" or "DFSM" in user-facing copy.
- **i18n coupling**: `DRIP/dfsa-i18n.js` keys on each page's exact English text. If you
  change visible copy, update the matching EN row (and its 5 translations) or the
  translation silently stops applying.
- **Opaque bundles** (single-file gzip builds — do not hand-edit beyond their plaintext
  wrapper; rebuild from source when revised): `When Women Lead.html` and
  `dsl-ip-monitoring/DSL-IP Monitoring System.html`. Verified 2026-09-26: their embedded
  payloads carry no DRIP/DFSM branding.
- **Programme facts stay**: references to the DSL-IP (the GEF-7 programme), ILAM, SLPF,
  REM, the KL modules and country cases are retained content, not branding — do not
  rename them.
- **One brand only (decided 2026-09-26)**: the former DFSM (Dryland Forest Support
  Mechanism) is retired and harmonized into DFSA — the Dryland Forest Support
  Accelerator — everywhere: page copy, titles, file names and the archive catalogue.
  The superseded `DFSM Campaign.html` was removed (its successor is
  `DFSA Campaign.html`; the old page survives in git history).
