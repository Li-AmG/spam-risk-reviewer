import { readFileSync, writeFileSync } from 'node:fs';
const source = readFileSync(new URL('../fund-project-review/skills/spam-risk-reviewer/run.mjs', import.meta.url), 'utf8');
const main = source.slice(source.indexOf('function normalizePolicy('), source.indexOf('function buildEvidence('));
const helpers = source.slice(source.indexOf('function objectOr('), source.indexOf('function ensureInside('));
if (!main.includes('function reviewSpamRisk(') || !helpers.includes('function stringOr(')) throw new Error('Source structure changed');
writeFileSync(new URL('core.mjs', import.meta.url), '// Adapted from spam-risk-reviewer-skill, commit d44746791b22b644798eefdca5c1fea3fa4c9389.\n' + main + helpers + '\nexport { normalizePolicy, reviewSpamRisk };\n');
