function reviewSummary(report) {
  if (!report) return '';
  const lines = [
    `Spam Risk Reviewer: ${report.verdict.risk_level.toUpperCase()}`,
    `${report.verdict.blockers.length} ${report.verdict.blockers.length === 1 ? 'item' : 'items'} to review`,
    `Subject: ${report.inputs.campaign_draft.subject}`,
  ];
  if (report.review_notes.length) {
    lines.push('', 'Review items:');
    for (const note of report.review_notes) lines.push(`- ${note}`);
  } else {
    lines.push('', 'No blockers in these inputs.');
  }
  lines.push('', 'Advisory only. This is not sending permission or a deliverability guarantee.');
  return lines.join('\n');
}

export { reviewSummary };

