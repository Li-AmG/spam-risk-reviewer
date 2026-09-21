# Privacy

Spam Risk Reviewer is designed as a local browser demo.

## What Stays In The Browser

The current web page does not send campaign form entries to a server. The review is calculated in the browser using JavaScript files served by the site.

The current page does not use:

- Analytics.
- Remote fonts.
- AI inference.
- Login.
- Databases.
- Campaign uploads.
- Email sending.

## Downloaded Reports

If a user downloads a JSON report, that file includes the campaign details entered in the form. Treat exported reports as campaign data and review them before sharing.

## What This Tool Does Not Verify

The demo does not independently check DNS, SPF, DKIM, DMARC, blocklists, consent records, inbox placement, or ESP account status. It reviews values supplied by the user.

## Future Changes

If future versions add AI review, analytics, storage, login, or integrations, the project should update this file and clearly state what leaves the browser before the feature is released.

