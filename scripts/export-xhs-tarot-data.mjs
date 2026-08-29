import { build } from 'esbuild';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, '..');
const tempDir = await mkdtemp(join(tmpdir(), 'solaris-luna-xhs-'));
const bundlePath = join(tempDir, 'tarot-data.cjs');
const outputPath = join(projectRoot, 'xhs-miniapp', 'data', 'tarot.js');

try {
  await build({
    entryPoints: [join(projectRoot, 'src', 'data', 'tarotCards.ts')],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    target: ['es2018'],
    define: {
      'import.meta.env.BASE_URL': JSON.stringify('/assets/'),
    },
    outfile: bundlePath,
    logLevel: 'silent',
  });

  const exported = await import(`${pathToFileURL(bundlePath).href}?v=${Date.now()}`);
  const source = `'use strict';\n\n// Generated from src/data/tarotCards.ts. Run npm run xhs:data after editing the web card data.\nmodule.exports = ${JSON.stringify({
    questionCategories: exported.questionCategories,
    spreads: exported.spreads,
    tarotCards: exported.tarotCards,
  }, null, 2)};\n`;

  await writeFile(outputPath, source, 'utf8');
  const written = await readFile(outputPath, 'utf8');
  console.log(`Generated ${outputPath} (${written.length} bytes)`);
} finally {
  await rm(tempDir, { recursive: true, force: true });
}
