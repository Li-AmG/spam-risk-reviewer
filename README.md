# Spam Risk Reviewer

A small, privacy-friendly preflight checklist for email campaigns.

Spam Risk Reviewer turns basic sender and list-health signals into a plain-English review before a campaign is sent. It is designed for marketers, founders, growth teams, and open-source builders who want a quick sanity check without uploading campaign data to a third-party service.

Live demo: https://spam-risk-reviewer.wt820101.workers.dev

## What It Checks

- Sender authentication: SPF, DKIM, and DMARC status as reported by the user.
- List health: bounce rate, complaint rate, list age, and sender warm-up time.
- Simple wording risks: a few obvious phrases such as `urgent`, `expires tonight`, `free money`, and `no unsubscribe`.
- Review output: a pass or hold decision, the specific items to review, and a downloadable JSON report.

The current default thresholds are intentionally simple:

- Bounce rate must be at or below 2%.
- Complaint rate must be at or below 0.1%.
- List age must be at or below 90 days.
- Sender warm-up must be at least 14 days.
- SPF, DKIM, and DMARC must all be marked as passed.

## Example Scenarios

The web demo includes four realistic sample campaigns:

- Opt-in newsletter: a healthy recurring update that should pass.
- Product launch: a larger campaign to active users that should still pass.
- Reactivation list: an older audience with list-health issues that needs review.
- Imported promo blast: a stale promotional send with authentication and wording problems that should be held.

These examples are synthetic. They are meant to show behavior, not to represent any real sender.

## Project Materials

- `LAUNCH.md`: GitHub/community description, short posts, feedback questions, and good first issues.
- `ROADMAP.md`: practical next milestones for keeping the project free, private, and useful.
- `CONTRIBUTING.md` and `PRIVACY.md`: contribution expectations and the browser-only data boundary.
- `LICENSE-OPTIONS.md`: notes on why MIT was selected for this demo.
- `REPOSITORY-CHECKLIST.md`: pre-publication checks for GitHub setup.

## Privacy

The demo runs entirely in the browser. It does not use remote fonts, analytics, AI inference, databases, or API keys. Form entries are not sent to a server by this page.

Downloaded JSON reports include the values entered in the form, so treat exported files as campaign data.

## Limits

This is an advisory tool, not a deliverability guarantee or permission to send.

It does not independently verify DNS, check blocklists, inspect HTML, validate consent records, or connect to an email service provider. The wording checks are basic substring rules and may miss problems or flag harmless text.

## Run Locally

From the workspace root:

```powershell
node spam-risk-demo/test.mjs
node spam-risk-demo/serve.mjs
```

Then open:

```text
http://127.0.0.1:4173/
```

The static site can also be served by any basic web server.

If working inside the `spam-risk-demo` directory, the same checks are available through npm-style scripts:

```powershell
node test.mjs
node --check app.mjs
node serve.mjs
```

## Deploy

The public Cloudflare Worker is `spam-risk-reviewer`.

Only deploy these public assets:

- `index.html`
- `styles.css`
- `app.mjs`
- `core.mjs`
- `_headers`
- `robots.txt`
- `sitemap.xml`

`wrangler.jsonc` targets the existing Worker. For a clean deployment, stage only the seven public files in a temporary directory, then deploy that directory with Wrangler.

From inside `spam-risk-demo`, prepare a local staging directory with:

```powershell
node stage-public-assets.mjs
pnpm dlx wrangler@latest deploy --dry-run --name spam-risk-reviewer --compatibility-date 2026-09-20 --assets .deploy-public
```

If the dry run is clean, use the same command without `--dry-run` when you are ready to publish.

## Development Notes

`core.mjs` is generated from the reviewed project code with:

```powershell
node spam-risk-demo/build-core.mjs
```

Validation currently covers the existing fixtures, missing signals, threshold boundaries, unknown authentication, wording review, and browser-level checks on the deployed page.

## License

MIT. See `LICENSE`.
