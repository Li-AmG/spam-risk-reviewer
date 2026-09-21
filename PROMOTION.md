# Promotion Plan

This plan is for sharing Spam Risk Reviewer with overseas users and open-source communities without overstating its maturity.

## Positioning

Spam Risk Reviewer is an early, browser-only preflight checklist for email campaign risk signals. It is useful when a founder, marketer, or builder wants to review basic sender authentication status, list-health metrics, and obvious wording risks before handing a campaign to an ESP or reviewer.

Use these phrases:

- "early demo"
- "preflight checklist"
- "browser-only"
- "rule-based"
- "caller-provided signals"
- "advisory review"

Avoid these phrases:

- "deliverability guarantee"
- "spam score"
- "DNS verifier"
- "AI compliance reviewer"
- "permission to send"
- "production platform"

## Best First Channels

Start small and ask for feedback, not growth.

1. GitHub repository README and release page.
2. Indie Hackers or maker communities, with a feedback-focused post.
3. Hacker News "Show HN" only after one or two more polish passes.
4. Reddit communities only where project feedback is welcomed; avoid promotional wording.
5. LinkedIn or X as a short build-in-public note.

## Primary Community Post

Title:

```text
I built a browser-only preflight checker for email campaign risk signals
```

Body:

```text
I am building a small open-source demo called Spam Risk Reviewer.

It reviews a few basic signals before an email campaign goes out: SPF/DKIM/DMARC status as reported by the user, bounce rate, complaint rate, list age, sender warm-up time, and a few obvious wording risks.

The current version is intentionally simple. It runs locally in the browser, does not require login, does not call an AI model, does not use analytics, and does not upload campaign details to a server.

Live demo: https://spam-risk-reviewer.wt820101.workers.dev
Source: https://github.com/Li-AmG/spam-risk-reviewer

I would love feedback on:

1. Are these the right first signals for a lightweight email preflight checklist?
2. Which policy preset feels most useful: conservative, standard, or lenient?
3. What would you want to see before sharing this with a growth or compliance reviewer?

Clear limits: this is not a deliverability guarantee, DNS verifier, or permission-to-send system. It is an early checklist-style tool.
```

## Short Social Post

```text
I built Spam Risk Reviewer, a small browser-only preflight checklist for email campaign risk signals.

It reviews sender auth status, list health, warm-up time, policy presets, and a few wording risks. No login, no analytics, no AI call, no campaign upload.

Demo: https://spam-risk-reviewer.wt820101.workers.dev
Source: https://github.com/Li-AmG/spam-risk-reviewer
```

## GitHub Release Follow-Up

```text
v0.1.0 is live for Spam Risk Reviewer.

The demo now includes five realistic scenarios, pass/review/hold results, copyable summaries, JSON export, a compact how-it-works section, and visible policy presets.

It is still an early browser-only rule-based demo. Feedback on thresholds and review wording would be especially useful.
```

## Reply Templates

### If someone asks whether it verifies SPF/DKIM/DMARC

```text
Not yet. The current demo uses SPF/DKIM/DMARC status supplied by the reviewer or email provider. It does not do DNS lookup. I kept that limitation visible so the first version stays private and easy to inspect.
```

### If someone asks why there is no AI

```text
I started with fixed rules so people can inspect the behavior and challenge the thresholds. AI might be useful later for wording review, but I would want it to be optional and clear about what text leaves the browser.
```

### If someone asks whether it predicts inbox placement

```text
No. It is not an inbox placement predictor or permission-to-send system. It is a lightweight preflight checklist for obvious risk signals before a human or ESP review.
```

### If someone reports a false positive

```text
That is useful feedback. The wording checks are intentionally simple substring checks right now, so false positives are expected. If you can share a generic version of the case without private campaign data, I can turn it into a test scenario.
```

## Feedback To Collect

- Which thresholds feel too strict or too loose?
- Which missing signal would matter most: unsubscribe placement, spam complaint trend, recent send volume, domain age, or blocklist status?
- Would users prefer this as a static web page, CLI, GitHub Action, or ESP checklist template?
- Should teams be able to save a local policy file without a server account?
- Is the current pass/review/hold language clear enough for non-technical reviewers?

## Promotion Checklist

Before posting broadly:

- Confirm the live demo opens and the View source link points to GitHub.
- Keep the first post feedback-focused.
- Do not claim users, revenue, funding, or production readiness.
- Do not imply the tool sends email or verifies DNS.
- Be ready to open issues from concrete feedback.
