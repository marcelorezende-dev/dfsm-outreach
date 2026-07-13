# DFSA — Dryland Forest Support Accelerator

This design project holds the DFSA: FAO's Dryland Forest Support Accelerator. It contains
(a) the DFSA/DFSM advocacy products (DFSM Campaign, Call to Action on Dryland Forests,
CBD side event, COFO WG collateral, COP30 Roadmap contribution, Finance Tracker), and
(b) the **DFSA platform** in `DFSA/` — the Accelerator's knowledge platform. Content is
retained; the design is being revised.

## Temporary visual identity (interim)

The DFSA does not yet have its own design language. Until it does, the project runs on a
**temporary identity adopted from the DSL-IP system** — do not present it as final.

- **Foundation tokens** live in `colors_and_type.css` (root) and `DFSA/colors_and_type.css`:
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

## Naming rules

The legacy platform name (the retired "DRIP" acronym / "Dryland Research & Information
Platform") has been **fully removed** — from visible copy, page and asset file names, CSS
class names and JS identifiers. The rename pass completed 2026-07-12.

- **Everything is DFSA**: pages (`DFSA.html`, `DFSA Manual 01–03 …`), shared assets
  (`dfsa-i18n.js`, `dfsa-topbar.css`, `dfsa-manual.css`, `dfsa-pages.css`,
  `dfsa-harmonize.css`, `dfsa-home.js`, `dfsa-archive.js`), the `.dfsa-topbar` CSS class
  and JS globals (`window.DFSA_ARCHIVE`). Never reintroduce the old acronym in any layer.
- **One deliberate exception**: the English phrase "drip irrigation" (a farming technique,
  e.g. in the Sisteminha page) is ordinary language — do not "fix" it.
- **i18n coupling**: `DFSA/dfsa-i18n.js` keys on each page's exact English text. If you
  change visible copy, update the matching EN row (and its 5 translations) or the
  translation silently stops applying.
- **Opaque bundles** are single-file gzip builds — do not hand-edit; decode the
  `__bundler/template`, edit, re-encode (escaping `</script>`), or rebuild from source:
  `DFSA/When Women Lead.html`, `DFSA/dsl-ip-monitoring/DSL-IP Monitoring System.html`.
  Both have been de-branded and carry the current top bar.
- **Programme facts stay**: references to the DSL-IP (the GEF-7 programme), ILAM, SLPF,
  REM, the KL modules and country cases are retained content, not branding — do not
  rename them.
- **Platform ≠ mechanism**: DFSA is the platform/accelerator; DFSM is the Dryland Forest
  Support Mechanism named in the advocacy products. Keep the two distinct in copy.
