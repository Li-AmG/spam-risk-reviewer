# Repository Checklist

Use this before publishing or syncing the demo to GitHub.

## Required Before Public Launch

- Confirm whether this demo belongs in the existing `spam-risk-reviewer-skill` repository or a new repository.
- Confirm the MIT license still matches the maintainer's intent.
- Confirm the GitHub repository description and topics from `LAUNCH.md`.
- Make sure no local logs, credentials, cache folders, or `.wrangler` files are committed.
- Run `node test.mjs` and `node --check app.mjs`.
- Run `node stage-public-assets.mjs` before any Cloudflare deployment and confirm the public asset list is complete.
- Open the live demo and run the four sample scenarios.

## Suggested Repository Files

- `README.md`
- `PRIVACY.md`
- `CONTRIBUTING.md`
- `ROADMAP.md`
- `LAUNCH.md`
- `LICENSE`
- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/feature_request.md`

## GitHub About Box

Description:

```text
Privacy-friendly email campaign preflight checks that run locally in your browser.
```

Website:

```text
https://spam-risk-reviewer.wt820101.workers.dev
```

Topics:

```text
email, deliverability, marketing-ops, privacy, static-site, cloudflare-workers, javascript
```

## Do Not Claim Yet

- Production readiness.
- Deliverability guarantees.
- DNS verification.
- Existing users or customers.
- Funding, sponsorship, or approval by GitHub, Cloudflare, OpenAI, or an ESP.
