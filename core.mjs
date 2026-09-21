// Adapted from spam-risk-reviewer-skill, commit d44746791b22b644798eefdca5c1fea3fa4c9389.
function normalizePolicy(raw = {}) {
  return {
    max_bounce_rate: numberOr(raw.max_bounce_rate, 0.02),
    max_complaint_rate: numberOr(raw.max_complaint_rate, 0.001),
    max_freshness_days: numberOr(raw.max_freshness_days, 90),
    min_warm_up_days: numberOr(raw.min_warm_up_days, 14),
  };
}

function numberOr(value, fallback) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function reviewSpamRisk(rawInputs, policy) {
  const campaign = objectOr(rawInputs.campaign_draft);
  const list = objectOr(rawInputs.list_metadata);
  const auth = objectOr(rawInputs.sender_auth_posture);
  const blockers = [];
  const evidenceSummary = [];

  const from = stringOr(campaign.from);
  const subject = stringOr(campaign.subject);
  const digest = stringOr(campaign.content_digest);
  const size = numberOr(list.size, -1);
  const bounceRate = numberOr(list.bounce_rate, -1);
  const complaintRate = numberOr(list.complaint_rate, -1);
  const freshness = numberOr(list.freshness, -1);
  const spfPass = auth.spf_pass === true;
  const dkimPass = auth.dkim_pass === true;
  const dmarcPass = auth.dmarc_pass === true;
  const warmUpDays = numberOr(auth.warm_up_days, -1);

  if (!from) blockers.push("campaign_draft.from is required");
  if (!subject) blockers.push("campaign_draft.subject is required");
  if (!digest) blockers.push("campaign_draft.content_digest is required");
  if (size < 0) blockers.push("list_metadata.size is required");
  if (bounceRate < 0) blockers.push("list_metadata.bounce_rate is required");
  if (complaintRate < 0) blockers.push("list_metadata.complaint_rate is required");
  if (freshness < 0) blockers.push("list_metadata.freshness is required");
  if (!spfPass) blockers.push("SPF did not pass");
  if (!dkimPass) blockers.push("DKIM did not pass");
  if (!dmarcPass) blockers.push("DMARC did not pass");
  if (warmUpDays < 0) blockers.push("sender_auth_posture.warm_up_days is required");
  if (bounceRate > policy.max_bounce_rate) {
    blockers.push(`bounce_rate ${bounceRate} exceeds ${policy.max_bounce_rate}`);
  }
  if (complaintRate > policy.max_complaint_rate) {
    blockers.push(`complaint_rate ${complaintRate} exceeds ${policy.max_complaint_rate}`);
  }
  if (freshness > policy.max_freshness_days) {
    blockers.push(`list freshness ${freshness} days exceeds ${policy.max_freshness_days}`);
  }
  if (warmUpDays < policy.min_warm_up_days) {
    blockers.push(`warm_up_days ${warmUpDays} below ${policy.min_warm_up_days}`);
  }

  const contentFlags = detectContentFlags(`${subject} ${digest}`);
  for (const flag of contentFlags) {
    blockers.push(`content risk flag: ${flag}`);
  }

  evidenceSummary.push(`auth spf=${spfPass} dkim=${dkimPass} dmarc=${dmarcPass}`);
  evidenceSummary.push(`list size=${size} bounce_rate=${bounceRate} complaint_rate=${complaintRate} freshness=${freshness}`);
  evidenceSummary.push(`policy bounce<=${policy.max_bounce_rate} complaint<=${policy.max_complaint_rate} freshness<=${policy.max_freshness_days} warm_up>=${policy.min_warm_up_days}`);
  if (contentFlags.length > 0) {
    evidenceSummary.push(`content flags=${contentFlags.join(", ")}`);
  } else {
    evidenceSummary.push("content flags=none");
  }

  const preflightClear = blockers.length === 0;
  let riskLevel = "pass";
  let escalation = "none";
  if (!preflightClear) {
    riskLevel = blockers.some((reason) => reason.includes("did not pass") || reason.includes("exceeds"))
      ? "hold"
      : "review";
    escalation = "needs_human";
  }

  return {
    risk_level: riskLevel,
    preflight_clear: preflightClear,
    blockers,
    evidence_summary: evidenceSummary,
    escalation,
    dispatch_target: "send-as",
    effect_boundary: "public_send remains owned by governed send-as, not this skill",
  };
}

function detectContentFlags(text) {
  const normalized = text.toLowerCase();
  const flags = [];
  for (const [needle, label] of [
    ["urgent", "urgency language"],
    ["expires tonight", "short-deadline promotion"],
    ["free money", "misleading financial language"],
    ["no unsubscribe", "missing unsubscribe signal"],
  ]) {
    if (normalized.includes(needle)) {
      flags.push(label);
    }
  }
  return flags;
}

function objectOr(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function stringOr(value) {
  return typeof value === "string" ? value : "";
}


export { normalizePolicy, reviewSpamRisk };
