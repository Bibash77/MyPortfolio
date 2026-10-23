# Localization and companion implementation report

## Baseline

- Repository baseline: `dc6300f` on `main` (18 project cards, five employers).
- Public production HTML downloaded on 2026-10-23 was byte-for-byte identical to baseline `index.html`.
- HTTP headers identified Vercel static hosting with cached HTML; no repository deployment configuration existed.
- Read the complete HTML, JavaScript, CSS and README. The only local visual asset is `assets/profile.jpg`, retained unchanged. Existing breakpoints: 1050px and 720px.
- Existing source duplicated project summaries between cards and timeline. The new generated knowledge source reads both, including assignment dates, without adding a separate authored profile.

## Implementation

- No framework migration. Generated English/Japanese HTML with an explicit translation catalog; 319 bilingual entries, including technical/proper-name entries. Stable content-derived keys and a strict build prevent missing catalog entries from silently falling back to English.
- Complete translated navigation, professional descriptions, responsibilities, tools, search/filter/count labels, workflow diagrams, education, teaching, languages, accessible descriptions and SEO metadata. Technical names remain recognizable.
- Static root-only Vercel country rewrites, early saved-preference handling, portable browser fallback, explicit locale URLs, localized canonical/hreflang/Open Graph tags and an in-place persistent switch.
- Mobile navigation is available; desktop section structure is preserved. Fixed the hero's minimum-content overflow and protected custom typing from the existing `/` shortcut.
- Original SVG kitty and native responsive dialog with all seven topics, exact prompt preview, bilingual response selection, exact custom text preservation, truthful copy feedback/manual fallback and existing professional contact links.
- Offline prompt generation with topic-specific profile context and conservative bilingual grounding instructions. No LLM service, backend, GPS permission, analytics or new recurring service.

## Files

- Authored: `tools/page.html`, `tools/build.py`, `i18n/catalog.json`, `i18n/locale.js`, `i18n/apply.js`, `companion/companion.js`, `companion/companion.css`, `companion/prompts.js`, `vercel.json`, tests, README and this report.
- Generated: root/index locale pages, two hosting-selected pages, `i18n/messages.js`, `data/profile.js`.
- Updated existing `script.js` for bilingual search, filter accessibility and safe keyboard shortcuts. Existing `styles.css` and portrait are unchanged; scoped additions reuse its design tokens.

## Validation and deployment limits

- `python3 tools/build.py`: passed, five generated pages; catalog completeness enforced.
- `node tests/integrity.cjs`: 410 assertions passed covering locale precedence, catalog parity, prompt presets in both languages, exact custom text, metadata and country routing configuration.
- `node tests/browser.cjs`: 173 Chromium assertions passed across both locales and 375/768/1280/1920px; simulated countries, persistence, explicit URL conflicts, blocked storage, search terms, filters, all seven options, copy success/failure, response-language overrides, keyboard focus loop/restoration and reduced motion.
- Browser scripts emitted no page-script errors. Normal-network inspection found the original SB Solutions favicon service returning 404; production also lacks a favicon.ico. These predate this change.
- Inspected screenshots of desktop/mobile English/Japanese, the Japanese menu and mobile custom prompt, and Japanese timeline/skills/projects/workflow. Deterministic screenshot runs block external fonts/icons; additional desktop inspection allowed normal network access.
- Structural comparison confirmed both generated locale pages retain every original anchor/external link, image count and a single h1. JavaScript syntax checks and `git diff --check` passed.
- New translation/profile/companion files total approximately 109 KB uncompressed (about 33 KB gzip), excluding generated HTML and the small locale/apply scripts. No runtime packages were added.

 Country behavior is simulated locally; actual Vercel routing and remote-IP behavior require a preview. No DNS, production deployment or merge is performed by this task. A PR may trigger the repository's existing preview integration.

The explicit locale URL intentionally takes priority over conflicting saved preference, as required for deliberately opened `/ja/` and `/en/` links. Stored manual choice governs automatic root visits. On unknown-country static hosting the default is browser language, not geographic detection. With JavaScript disabled, the static country-selected locale remains readable but localStorage preference and companion interactions cannot apply.

Professional evidence is self-published. Existing “Present” dates, high-level Mohini details, mixed category tags and incomplete production-status documentation are preserved conservatively. No qualifications, numerical impact, hiring suitability, visa details or unpublished contact information were inferred. Context-aware suggestions were omitted to avoid complexity.

## Delivery status

Feature branch: `feature/japanese-localization-companion` (published to GitHub). The implementation is committed. `docs/pull-request.md` contains the prepared PR title/body. The working tree is clean after committing delivery documentation.

Publishing succeeded using the account's existing SSH authentication. The repository's push URL now uses `git@github.com:Bibash77/MyPortfolio.git`; its fetch URL is unchanged. HTTPS Git credentials are unavailable, and the connected GitHub integration still returns HTTP 403 `Resource not accessible by integration` for write operations, including PR creation. The feature branch is published, but no PR was created. `docs/pull-request.md` contains the prepared description. No merge or production deployment was performed. A portable Git bundle and patch are available under ignored `output/`.
