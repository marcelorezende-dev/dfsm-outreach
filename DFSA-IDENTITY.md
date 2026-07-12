# DFSA — Dryland Forest Support Accelerator

This design project holds the DFSA: FAO's Dryland Forest Support Accelerator. It contains
(a) the DFSA/DFSM advocacy products (DFSM Campaign, Call to Action on Dryland Forests,
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

- **File names keep their legacy DRIP names** (`DRIP/DFSA.html`, `DRIP Map.html`,
  `drip-*.js`, `.drip-topbar` CSS classes) for link integrity. Renaming happens in a
  dedicated pass, never casually.
- **Visible brand text is always DFSA** — never reintroduce "DRIP" or
  "Dryland Research & Information Platform" in user-facing copy.
- **i18n coupling**: `DRIP/drip-i18n.js` keys on each page's exact English text. If you
  change visible copy, update the matching EN row (and its 5 translations) or the
  translation silently stops applying.
- **Opaque bundles still carry old branding internally** (single-file gzip builds — do not
  hand-edit; rebuild from source when revised): `DRIP/When Women Lead.html`,
  `DRIP/DSL-IP Constellation Dashboard.html`,
  `DRIP/dsl-ip-monitoring/DSL-IP Monitoring System.html`.
- **Programme facts stay**: references to the DSL-IP (the GEF-7 programme), ILAM, SLPF,
  REM, the KL modules and country cases are retained content, not branding — do not
  rename them.
- **Platform ≠ mechanism**: DFSA is the platform/accelerator; DFSM is the Dryland Forest
  Support Mechanism named in the advocacy products. Keep the two distinct in copy.
