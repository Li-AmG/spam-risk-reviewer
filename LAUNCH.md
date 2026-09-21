# Spam Risk Reviewer Launch Kit

This file is a practical starter kit for sharing the project with overseas users and open-source communities. It avoids claims about users, funding, or production readiness that have not been established.

## One-Line Description

Privacy-friendly email campaign preflight checks that run locally in your browser.

## Short Project Description

Spam Risk Reviewer is a small browser-based checklist for reviewing sender authentication, list health, and obvious wording risks before an email campaign is sent. It is useful for early-stage founders, marketers, and builders who want a quick sanity check without uploading campaign details to another service.

## GitHub About Box

- Description: `Privacy-friendly email campaign preflight checks that run locally in your browser.`
- Website: `https://spam-risk-reviewer.wt820101.workers.dev`
- Topics: `email`, `deliverability`, `marketing-ops`, `privacy`, `static-site`, `cloudflare-workers`, `javascript`, `open-source`

## README Opening Pitch

Email teams often have the right signals in front of them, but the handoff before sending is still easy to rush. Spam Risk Reviewer turns those basic sender and list-health signals into a clear preflight result: pass, hold, and the specific items to review.

The demo runs entirely in the browser. It does not send email, call an AI model, use analytics, or upload campaign data to a server.

## Community Post

Title:

```text
I built a small browser-only preflight checker for email campaign risk signals
```

Body:

```text
I am working on a small open-source demo called Spam Risk Reviewer.

It checks basic email campaign signals before a send: SPF/DKIM/DMARC status as reported by the user, bounce rate, complaint rate, list age, sender warm-up time, and a few obvious wording risks.

The current demo is intentionally simple and private. It runs in the browser, does not call an AI model, does not use analytics, and does not upload campaign data.

Live demo: https://spam-risk-reviewer.wt820101.workers.dev

I would like feedback on two things:

1. Are these the right first signals for a lightweight preflight checklist?
2. What would make this useful before handing a campaign to an ESP or compliance reviewer?

It is not a deliverability guarantee, DNS verifier, or sending permission system. It is an early checklist-style tool.
```

## Short Social Post

```text
I built a small browser-only email campaign preflight checker.

It reviews sender auth status, list health, warm-up time, and a few obvious wording risks before a send. No login, no analytics, no AI call, no campaign upload.

Demo: https://spam-risk-reviewer.wt820101.workers.dev
```

## Maintainer Notes For Replies

- Say "early demo" or "preflight checklist", not "production deliverability platform".
- Say the app uses caller-provided SPF/DKIM/DMARC status; it does not verify DNS.
- Say the browser page does not upload form data.
- The demo is MIT licensed; avoid implying that the original skill repository has the same license unless it is updated separately.
- Do not claim customers, adoption, revenue, or funding.
- If someone asks for AI, explain that the first version is rule-based so users can inspect the behavior.

## Good First Issues

- Add an optional field for ESP/provider name and include it in exported JSON.
- Add a compact "copy review summary" button.
- Add a third result level for "review" scenarios rather than only pass/hold.
- Add tests for every built-in web demo scenario.
- Add configurable thresholds in the web UI with clear defaults.
- Add a plain-English explanation panel for each rule.

## Feedback Questions

- Which risk signal would you add first: spam complaint trend, unsubscribe placement, domain age, or recent send volume?
- Would you prefer this as a standalone web page, a CLI tool, or a GitHub Action?
- Should thresholds be strict defaults, editable presets, or imported from a policy file?
- What evidence should a reviewer see before approving a risky campaign?
