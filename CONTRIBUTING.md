# Contributing

Thanks for taking a look at Spam Risk Reviewer.

This is an early demo. The most useful contributions right now are small, specific, and easy to verify.

## Good Contributions

- Clear bug reports with steps to reproduce.
- Better wording for review messages and rule explanations.
- Additional realistic sample scenarios with synthetic data.
- Tests for existing behavior.
- Small UI improvements that keep the tool fast and understandable.

## Before Changing Rules

Please explain the problem first. Email risk thresholds vary by sender, provider, consent model, and audience, so rule changes should include:

- The signal being changed.
- Why the current behavior is confusing or risky.
- A simple before/after example.
- Any tradeoff or false-positive risk.

## Privacy Expectations

Do not add analytics, remote tracking, form submission, AI calls, or third-party scripts without making the data flow clear in the README and UI.

The current demo is intentionally browser-only. Preserving that trust is more important than adding features quickly.

## License Note

This demo is shared under the MIT License. By contributing, you agree that your contribution can be distributed under the same license.
