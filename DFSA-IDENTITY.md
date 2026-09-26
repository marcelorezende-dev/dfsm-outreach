# DFSA – Dryland Forest Support Accelerator

This design project holds the DFSA: FAO's Dryland Forest Support Accelerator. It contains
(a) the DFSA advocacy products (DFSA Campaign, Call to Action on Dryland Forests,
CBD side event, COFO WG collateral, COP30 Roadmap contribution, Finance Tracker), and
(b) the **DFSA platform** in `DRIP/` – the former DRIP site being converted into the
Accelerator's knowledge platform. Content is retained; the design is being revised.

## Temporary visual identity (interim)

The DFSA does not yet have its own design language. Until it does, the project runs on a
**temporary identity adopted from the DSL-IP system** – do not present it as final.

- **Foundation tokens** live in `colors_and_type.css` (root) and `DRIP/colors_and_type.css`:
  cream paper `#F5F2E8`, ink `#241F1B`, forest `#477E59`, clay `#CF715D`/`#B4543F`,
  amber `#F8B133`; display face DermawanRough (Oswald fallback), Merriweather serif body,
  Poppins sans for UI/labels.
- **DFSA marks**: wordmark `DFSA` + amber dot (`DFSA<span>.</span>`); subtitle
  "Dryland Forest Support Accelerator".
- **DFSA accent**: the platform top bar is deep clay `#6E3B2C` (the DSL-IP forest green
  `#1f523a` is retired for platform chrome); amber stays the highlight colour.
- When the real DFSA identity is defined, swap the tokens in `colors_and_type.css` once –
  pages consume variables, not hard-coded colours (legacy pages with inline palettes are
  being migrated as they are revised).

## Conversion rules (DRIP → DFSA)

- **File names are DFSA too** (renamed 2026-09-26): the manual series is
  `DFSA Manual *.html`, the summary is `DFSA Summary.html`, and the shared assets are
  `dfsa-*.js` / `dfsa-*.css` (CSS classes follow: `.dfsa-topbar`). Never reintroduce
  `drip-`/`DRIP `/`DFSM ` file names; any rename must update every reference in the
  same pass and be link-checked.
- **Visible brand text is always DFSA** – never reintroduce "DRIP",
  "Dryland Research & Information Platform" or "DFSM" in user-facing copy.
- **i18n coupling**: `DRIP/dfsa-i18n.js` keys on each page's exact English text. If you
  change visible copy, update the matching EN row (and its 5 translations) or the
  translation silently stops applying.
- **Opaque bundles** (single-file gzip builds – do not hand-edit beyond their plaintext
  wrapper; rebuild from source when revised): `When Women Lead.html` and
  `dsl-ip-monitoring/DSL-IP Monitoring System.html`. Verified 2026-09-26: their embedded
  payloads carry no DRIP/DFSM branding.
- **Programme facts stay**: references to the DSL-IP (the GEF-7 programme), ILAM, SLPF,
  REM, the KL modules and country cases are retained content, not branding – do not
  rename them.
- **One brand only (decided 2026-09-26)**: the former DFSM (Dryland Forest Support
  Mechanism) is retired and harmonized into DFSA – the Dryland Forest Support
  Accelerator – everywhere: page copy, titles, file names and the archive catalogue.
  The superseded `DFSM Campaign.html` was removed (its successor is
  `DFSA Campaign.html`; the old page survives in git history).

## Editorial style (FAOSTYLE) – applies to ALL copy, existing and forthcoming

The platform follows **FAOSTYLE: English** (FAO house style, revised November 2024).
A platform-wide compliance pass was run on 2026-09-26. Rules that matter most here:

### Spelling and word choice
- FAO spelling: **-ize** (organize, realize) but **analyse**; **-our** (colour, labour,
  behaviour); **centre**; **programme** (use *program* only for software); **licence** (n.) /
  **license** (v.); **towards** not toward; **while/among** not whilst/amongst.
- Recommended words used on this platform: **fuelwood** (never firewood), **savannah**,
  **drylands** (n.) / **dryland** (adj.), **agrifood**, **smallholder**, **well-being**,
  **policymaker**, **Indigenous Peoples** (always capitalized).
- Proper names keep their original spelling (e.g. Shashe Small Farmer Organisation,
  Organisation for Economic Co-operation and Development). Quoted material is never restyled.

### Punctuation and numbers
- **En-dash only – FAO does not use the em-dash.** Spaced pairs for asides ( – ), unspaced
  for ranges and equal-weight pairs (2015–2025, South–South). Translations keep their own
  dash conventions (Russian and Chinese legitimately use —).
- Numbers one to ten in words, 11 upwards in numerals; always numerals with units,
  percentages, money and dates. **percent** in running text; the **%** symbol only in stat
  tiles, tables and figures. Thousands with spaces (10 000). Dates: 16 October 2000.
  Decades: the 1990s.

### FAO terminology
- First mention: **Food and Agriculture Organization of the United Nations (FAO)** – the
  abbreviation after the full name, never after "Organization". Then **FAO** (never "the
  FAO" standing alone; "the FAO Committee on Forestry" is fine). Write **an FAO** project.
- **Members / Member Nations** (capitalized) for FAO membership; FAO **headquarters**
  (lower-case h, never HQ); **the Near East** not the Middle East; country names follow
  **NOCS** (Viet Nam, the Niger, United Republic of Tanzania).
- Acronyms are spelled out at first mention on each page (glossary: `ACRONYMS.md`;
  applied platform-wide 2026-07-14). No acronyms in titles except FAO and COVID-19.

### Photographs and artwork
- Every photo carries an adjacent credit: **©FAO/Photographer** (FAO staff/commissioned),
  **©Name** (external), **©FAO** if the photographer is unknown. Editorial-use-only images
  keep their required credit (e.g. the baobab on the home page). Cleared/licensed images
  only – the photo placeholders across the platform carry a "©FAO / credit to confirm"
  slot that MUST be resolved before a real image is published.
- Captions are brief and explanatory; name the country (NOCS Short Name) and project
  where relevant.

### Logos
- The **FAO logo** may only appear in official, FAO-cleared uses: never redrawn,
  recoloured, stretched, cropped or combined into new lock-ups, and not on adapted or
  unofficial products (the CC licence explicitly forbids it). Before any audience beyond
  internal review, confirm FAO communications sign-off on branding (see README).
- Partner and programme logos (GEF, DSL-IP `assets/logo-color.png`) are reproduced as
  supplied, with clear space, never modified.
- The **DFSA wordmark** (`DFSA` + amber dot) is the platform's own mark; it must not
  imitate or incorporate the FAO logo.

### Other page elements
- **Contact information** follows the FAO block: office/division name written out, generic
  email only (never personal addresses), short website URL (no https://www), then
  **Food and Agriculture Organization of the United Nations** and City, Country. No phone
  numbers.
- **Maps**: any map with dashed/dotted boundaries carries the FAO map disclaimer; country
  labels follow NOCS Short Names for Lists and Tables.
- **Hyperlinks**: linked text is underlined on hover at minimum; bare URLs may drop the
  underline and the https:// prefix in display text.
- **Citations** use the FAO author–date form: Author. Year. *Title*. Place, Publisher.

### Coupling rule (repeat)
Any change to visible English copy must update the matching EN row in `dfsa-i18n.js`
with the SAME transformation, or that string's translations silently stop applying.
`design-system/` is internal component spec, not FAO-facing copy – exempt from sweeps.
