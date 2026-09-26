# DFSA – Dryland Forest Support Accelerator (test site)

A static site. The home page is **`index.html`** (the DFSA hub); it links out to the
Constellation, the frameworks (ILAM, SLPF, REM), the Financial Architecture, the
Monitoring system, the Publication & funding plan, and the knowledge stories.

> Internal test deployment. A project of the DSL-IP, actively overseen by a UN Officer
> (programme design, complex programme management, AI, rural development); related to the
> Programme's behaviour-change research. Information is drawn from publicly available
> sources. A grievance / data-removal mechanism is built into the pages (generic contact:
> dsl-ip@fao.org).

## Hosting on fao.org (destination)

The platform will be hosted under **www.fao.org/dryland-forestry/en/** (FAO "Dryland
forests and agrosilvopastoral systems"). It is subpath-ready: every internal link and
asset reference is **relative** (verified: no absolute self-URLs), so the site works
unchanged under any base path. All script and style dependencies are self-hosted
(bundled fonts in `fonts/`, Leaflet in `assets/leaflet/`, Lucide in `assets/lucide/`);
the only remaining external requests are Google Fonts on a handful of campaign-style
pages (each declares local fallbacks) and the live data feeds (iNaturalist, EarthMap,
CARTO basemaps, Data Studio). The home page links back to the host section (footer and
Useful links). GitHub Pages (below) remains the staging deployment.

## Publish on GitHub Pages

1. Create a repository (public repo = free Pages; private needs a paid/Enterprise plan).
2. Upload **the contents of this folder** to the repo root (keep the folder structure:
   `assets/`, `fonts/`, `dsl-ip-monitoring/`, the `.html` files,
   `colors_and_type.css`, `gap-*.js`, `slpf-assets/`, and `.nojekyll`).
3. Repo **Settings → Pages → Source: Deploy from a branch → `main` / root → Save**.
4. Wait ~1 minute. The site is live at
   `https://<org-or-user>.github.io/<repo>/` and opens on the DFSA hub.

### Notes
- **Multilingual.** The DFSA hub (`DFSA.html`) auto-translates into Spanish, French,
  Russian, Arabic and Chinese via `dfsa-i18n.js` – small flag icons in the top banner
  switch language (Arabic flips to RTL); a notice flags the translations as automated
  and under review. English is the source of truth; switching back restores it exactly.
  Translations live in `dfsa-i18n.js` as one row per phrase – edit there to refine wording.
- `.nojekyll` is included so GitHub Pages serves all files verbatim (no Jekyll build).
- Filenames contain spaces; GitHub Pages serves these (URL-encoded as `%20`). Links
  already match, so they resolve. If you prefer clean URLs, rename files to hyphens
  and update the links in `index.html`.
- The Monitoring and When Women Lead pages are self-contained
  single-file builds. The other pages load shared `fonts/`, `assets/` and
  `colors_and_type.css`, plus Google Fonts / Lucide from their CDNs (online).
- Grievance links use the generic `dsl-ip@fao.org` address (FAOSTYLE-compliant). Before
  going live on fao.org, confirm FAO communications sign-off on branding/affiliation.
