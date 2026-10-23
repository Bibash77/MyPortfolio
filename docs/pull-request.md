# Add English/Japanese localization and Byte portfolio companion

Japanese-speaking visitors can read the complete professional portfolio and use an accessible, offline kitty companion to explore the profile and prepare grounded AI prompts. The existing static layout and professional facts are preserved.

- Prerender `/en/` and `/ja/` from one source HTML and a strict bilingual catalog; localize metadata and accessible labels.
- Make the root page Japanese by default, independent of country/browser settings, with saved manual preferences and explicit locale URLs.
- Add Byte's original SVG, seven bilingual topics, profile-derived prompt context, response-language override, exact custom input, preview, clipboard/manual fallback and existing professional links.
- Preserve bilingual project search and filters; improve mobile navigation, heading wrapping, anchor offsets, reduced motion and keyboard focus.

## Validation

- `python3 tools/build.py` — passed.
- `node tests/integrity.cjs` — 409 assertions passed.
- `node tests/browser.cjs` — 173 Chromium assertions passed, both locales at 375/768/1280/1920px, no page-script errors.
- Inspected desktop/mobile screenshots and the companion, including timeline, skills, projects and workflow.
- Original links/image count and heading structure retained; syntax checks and `git diff --check` passed.

## Deployment review

No production deployment or DNS change was performed. Serve the checked-in generated files as a static Vercel project and retain `vercel.json`. Japanese is prerendered at the root on every static host; no geolocation configuration is required. The owner requested Japanese as the universal default after the initial geographic implementation.

Profile evidence remains self-published. No undocumented achievements or qualifications were added. Existing external company-icon failures are unchanged. See README and `docs/implementation-report.md` for maintenance, hosting and source-data details.
