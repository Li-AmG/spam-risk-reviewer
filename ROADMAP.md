# Spam Risk Reviewer Roadmap

This roadmap keeps the project useful while staying free to operate. It assumes the current Cloudflare Workers static deployment and no paid API calls.

## Current State

- Static web demo deployed on Cloudflare Workers.
- Five built-in scenarios: opt-in newsletter, product launch, wording review, reactivation list, and imported promo blast.
- Rule-based review logic runs locally in the browser.
- No analytics, database, AI inference, login, or campaign upload.
- English README and launch copy are prepared locally.

## Next Practical Milestones

### 1. GitHub Repository Cleanup

- Decide whether this demo belongs in the existing repository or a new public repository.
- Choose a license only after confirming ownership and intended permissions.
- Add `README.md`, `LAUNCH.md`, `PROMOTION.md`, `ROADMAP.md`, and the public demo assets.
- Add a short repository description and topics from `LAUNCH.md`.
- Add issues from the "Good First Issues" section in `LAUNCH.md`.

### 2. Better Review Output

- Add richer guidance for the `review` state.
- Show a short reason next to each result badge.
- Add a "copy summary" button for sharing the review internally.
- Add tests for all five built-in demo scenarios.

### 3. Policy Presets

- Shipped visible threshold presets: conservative, standard, and lenient.
- Keep defaults clear and explain that thresholds are not universal delivery rules.
- Continue refining preset language and thresholds from user feedback.

### 4. Evidence And Trust

- Add a privacy note linked from the header or footer.
- Refine the compact "how it works" section with feedback from users.
- Keep the "no DNS verification" limitation visible.
- Add a changelog once public releases begin.

### 5. Optional AI Later

Only consider AI after the rule-based demo has real feedback. A useful first AI feature would be wording review for a short campaign summary, not a full email or subscriber list upload.

Before any AI integration:

- Confirm free quota is still available.
- Keep "use up and stop" protection enabled where available.
- Send the minimum text needed for the feature.
- Explain exactly what leaves the browser.
- Keep the rule-based path available.

## Not Planned Yet

- Paid hosting or paid AI calls.
- Sending email from the app.
- Storing campaign data on a server.
- Claiming inbox placement or deliverability guarantees.
- Replacing ESP compliance review.


