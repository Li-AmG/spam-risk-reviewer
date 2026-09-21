const scenarios = {
  low: {
    label: 'Opt-in newsletter',
    expected: { risk_level: 'pass', blockers: 0 },
    fields: {
      sender: 'newsletter@example.com',
      subject: 'Weekly product update',
      summary: 'Short opt-in newsletter for existing customers with unsubscribe footer.',
      size: 4200,
      freshness: 14,
      bounce: 0.8,
      complaint: 0.02,
      warmup: 45,
      spf: 'pass',
      dkim: 'pass',
      dmarc: 'pass',
    },
  },
  launch: {
    label: 'Product launch',
    expected: { risk_level: 'pass', blockers: 0 },
    fields: {
      sender: 'updates@saas-example.com',
      subject: 'New dashboard is available for your workspace',
      summary: 'Product launch email to active trial and paid users. It explains the new dashboard, links to release notes, and keeps the standard unsubscribe footer.',
      size: 18000,
      freshness: 32,
      bounce: 1.4,
      complaint: 0.05,
      warmup: 28,
      spf: 'pass',
      dkim: 'pass',
      dmarc: 'pass',
    },
  },
  wording: {
    label: 'Wording review',
    expected: { risk_level: 'review', blockers: 1 },
    fields: {
      sender: 'newsletter@example.com',
      subject: 'Urgent product note for account owners',
      summary: 'Short opt-in message for active customers with the standard unsubscribe footer and no deadline promotion.',
      size: 5200,
      freshness: 21,
      bounce: 0.9,
      complaint: 0.03,
      warmup: 40,
      spf: 'pass',
      dkim: 'pass',
      dmarc: 'pass',
    },
  },
  reactivation: {
    label: 'Reactivation list',
    expected: { risk_level: 'hold', blockers: 4 },
    fields: {
      sender: 'hello@retail-example.com',
      subject: 'We miss you - here is what changed',
      summary: 'Reactivation email to customers who have not opened recently. The audience is older, opt-out is included, and no purchase deadline is used.',
      size: 64000,
      freshness: 145,
      bounce: 3.2,
      complaint: 0.18,
      warmup: 21,
      spf: 'pass',
      dkim: 'pass',
      dmarc: 'unknown',
    },
  },
  high: {
    label: 'Imported promo blast',
    expected: { risk_level: 'hold', blockers: 7 },
    fields: {
      sender: 'promo@example.net',
      subject: 'URGENT discount expires tonight',
      summary: 'Promotional blast to a stale imported list with aggressive urgency language.',
      size: 28000,
      freshness: 190,
      bounce: 8.5,
      complaint: 0.6,
      warmup: 3,
      spf: 'pass',
      dkim: 'fail',
      dmarc: 'pass',
    },
  },
};

function scenarioInputs(fields) {
  return {
    campaign_draft: {
      from: fields.sender,
      subject: fields.subject,
      content_digest: fields.summary,
    },
    list_metadata: {
      size: fields.size,
      bounce_rate: fields.bounce / 100,
      complaint_rate: fields.complaint / 100,
      freshness: fields.freshness,
    },
    sender_auth_posture: {
      spf_pass: fields.spf === 'pass',
      dkim_pass: fields.dkim === 'pass',
      dmarc_pass: fields.dmarc === 'pass',
      warm_up_days: fields.warmup,
    },
  };
}

export { scenarios, scenarioInputs };
