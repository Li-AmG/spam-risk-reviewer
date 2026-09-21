import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

const publicAssets = [
  'index.html',
  'styles.css',
  'app.mjs',
  'core.mjs',
  'scenarios.mjs',
  'summary.mjs',
  '_headers',
  'robots.txt',
  'sitemap.xml',
];

const target = resolve(process.argv[2] || '.deploy-public');
rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });

for (const file of publicAssets) {
  cpSync(resolve(file), join(target, file));
}

console.log(`Staged ${publicAssets.length} public assets in ${target}`);
for (const file of publicAssets) {
  console.log(`- ${file}`);
}
