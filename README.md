# Bibash Bogati — bilingual engineering portfolio

Static HTML, CSS and JavaScript. The original dark layout, portrait, career timeline, project cards, diagrams, filtering and reveal animations are preserved. No framework, AI service, tracking or runtime dependencies were added.

## Run and maintain

```sh
python3 tools/build.py
python3 -m http.server 8080
# Open http://localhost:8080/ , /en/ or /ja/
node tests/integrity.cjs
```

Edit professional facts in **`tools/page.html`**, the source HTML. Edit English/Japanese copy in **`i18n/catalog.json`**. Original source strings identify catalog entries; the build emits stable SHA-256-derived keys. Unchanged technical and proper names are explicitly present in both languages. New text or meaningful attributes without a catalog entry fail the build. Both languages must have a nonempty value. Review new Japanese wording for accuracy; never increase the scope of responsibility in translation.

Run the builder and commit the generated files together: `index.html`, `en/index.html`, `ja/index.html`, `geo-en.html`, `geo-ja.html`, `i18n/messages.js`, and `data/profile.js`. Generated HTML has translated titles, descriptions, Open Graph metadata, canonical and alternate-language links. Each locale has complete HTML before JavaScript runs. The root English page is the portable unknown-country fallback. Assets use a root-relative base; subdirectory hosting requires adjusting that base and locale paths.

## Language selection and hosting

The deliberately opened `/ja/` or `/en/` route always wins over storage. At the automatic root URL the order is:

1. Explicit choice saved as `portfolio.locale` in localStorage.
2. Hosting-provided country: Japan → Japanese, any other known country → English.
3. Browser preferred languages, only if country is unknown: Japanese if present, otherwise English.
4. English when no signal is available.

The compact `EN | 日本語` switch changes the page and metadata in place, retains scroll/search/filter state, updates the locale URL with `replaceState`, and saves only the language choice. No cookies or location data are stored. Storage failures do not prevent switching. Visiting an explicit locale URL does not itself erase a saved manual choice; pressing the switch does.

**Vercel:** the checked-in `vercel.json` uses ordered, root-only rewrites based on Vercel's platform-provided `x-vercel-ip-country` header. Japan receives prerendered `geo-ja.html`; other known countries receive `geo-en.html`. These contain only a coarse country marker (`JP` or `OTHER`), never an IP address. Vercel supplies this header; the client does not submit a country or call an IP lookup API. The early head script checks saved preferences and, if necessary, redirects before body content is parsed. Explicit locale routes bypass country rewrites. Root caching is disabled and varies by country to avoid sharing personalized root responses.

References: [Vercel country headers](https://vercel.com/docs/headers/request-headers), [conditional rewrites](https://vercel.com/docs/project-configuration/vercel-json#rewrites).

Deploy the repository as a static project, with no build command or output-directory override required (generated files are committed). Preserve `vercel.json`. No DNS, domain or ownership changes are needed. These are static routing rules, with no Function invocation or paid service. Other static hosts can serve both locale directories but must implement their own trusted country routing if required. Without it, only browser-language fallback is available; timezone and browser language are not proof of geography. JavaScript-disabled visits use the prerendered hosting default; saved browser preferences cannot apply without JavaScript.

Country rules are simulated in browser tests, not validated against actual remote IPs. Confirm on a Vercel preview from Japan and another country, including cache behavior, before merging. Vercel's country `has` conditions are not exercised by Python's server or reliably by local `vercel dev`.

## Byte the Kitty

An original inline SVG with restrained blink/tail animations opens a native modal dialog. It supports keyboard focus containment, Escape, close/back controls, focus restoration, screen-reader copy feedback, touch layouts and reduced motion. The seven options cover introduction, projects, strengths, skills, recruiter review, custom questions and published LinkedIn/GitHub links.

`tools/build.py` extracts localized profile facts from the same source HTML used to build the visible site. `data/profile.js` contains employment dates, assignment dates, responsibilities, technologies, project categories/status, public links, education, teaching and language information. Project-card summaries and timeline details already overlap in the original source; keep their wording aligned when editing. Extraction avoids adding a third hand-maintained profile copy. Company and project identities remain as published; Japanese explanations are descriptive, not invented official names.

`companion/prompts.js` selects relevant context and adds bilingual purpose, source, grounding rules and response-language instructions. It identifies the profile as self-published and not independently verified. It preserves supporting/contributing/leading distinctions, labels experiments, avoids unsupported hiring claims and does not interpret N3 study as a JLPT certificate. Search keywords alone are explicitly not evidence of proficiency. Ambiguous production status remains unspecified. Mohini stays high-level/private; no undocumented implementation details are supplied.

The response language defaults to the site language and can be overridden without losing the chosen purpose or custom question. Visitor text is preserved exactly, separated from profile data, and rendered using `value`/`textContent`. Prompts are generated offline. No question or prompt is transmitted. Visitors can preview, copy and paste into their own AI; clipboard errors reveal and select the exact prompt for manual copying.

To add a preset, add its purpose in both languages in `companion/prompts.js`, its labels in both `copy` objects and its topic button in `companion/companion.js`, then choose relevant source sections in `buildPrompt`. Add integrity/browser checks. Context-aware suggestions and greeting bubbles are intentionally omitted to keep the interaction quiet and small.

## Verification

```sh
python3 tools/build.py
node tests/integrity.cjs
# Browser checks need Playwright and Chromium in the environment:
npm install --no-save --package-lock=false playwright
npx playwright install chromium
node tests/browser.cjs
# Optional: PORTFOLIO_URL and CHROMIUM_PATH overrides
```

The dependency-free integrity suite covers country/preference/URL precedence, translation parity, generated metadata, both languages for every prompt, preserved custom text and published facts. Browser checks cover both locales at 375, 768, 1280 and 1920px, navigation, all requested search terms, filters/counts across language changes, seven companion options, language overrides, clipboard success/failure, custom-input safety, Escape/focus restoration, persistence, storage failure and reduced motion. Screenshots are saved under ignored `output/playwright/`. Country tests serve the generated country document at `/` to simulate only the rewrite; they do not prove remote IP geolocation.

The original page uses external fonts, Devicon, company favicons and flag images. Prompts and the mascot have no external dependency. Browser regression tests block these external resources to remain deterministic; visual review should also be performed with normal network access. Prompt accuracy is limited to the owner's published portfolio, and existing relative dates such as “Present” require maintenance.

See [engineering report](docs/implementation-report.md) for this change's baseline, measured validation and remaining deployment checks.
