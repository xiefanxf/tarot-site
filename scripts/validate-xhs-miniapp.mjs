import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, '..');
const miniRoot = join(projectRoot, 'xhs-miniapp');

function readJson(path) {
  return readFile(path, 'utf8').then(JSON.parse);
}

function loadCommonJs(source, globals) {
  const module = { exports: {} };
  const context = Object.assign({ module, exports: module.exports }, globals || {});
  vm.runInNewContext(source, context, { timeout: 5000 });
  return module.exports;
}

const appConfig = await readJson(join(miniRoot, 'app.json'));
assert.ok(Array.isArray(appConfig.pages) && appConfig.pages.length > 0, 'app.json must declare at least one page');

for (const page of appConfig.pages) {
  for (const extension of ['js', 'json', 'xhsml', 'css']) {
    assert.ok(existsSync(join(miniRoot, `${page}.${extension}`)), `Missing ${page}.${extension}`);
  }
}

const tarotSource = await readFile(join(miniRoot, 'data', 'tarot.js'), 'utf8');
const tarotData = loadCommonJs(tarotSource);
assert.equal(tarotData.tarotCards.length, 78, 'The mini app must contain all 78 tarot cards');
assert.equal(new Set(tarotData.tarotCards.map((card) => card.id)).size, 78, 'Card IDs must be unique');
assert.equal(tarotData.spreads.length, 3, 'Expected three supported spreads');

for (const card of tarotData.tarotCards) {
  const assetPath = join(miniRoot, card.image.replace(/^\//, ''));
  assert.ok(existsSync(assetPath), `Missing card asset ${card.image}`);
}

const xhsCalls = { saved: null, toasts: [] };
const xhs = {
  getSystemInfoSync() {
    return { theme: 'light' };
  },
  setStorage(options) {
    xhsCalls.saved = options.data;
    if (options.success) options.success({ errMsg: 'setStorage:ok' });
  },
  showToast(options) {
    xhsCalls.toasts.push(options.title);
  },
};

let pageConfig;
const pageSource = await readFile(join(miniRoot, 'pages', 'index', 'index.js'), 'utf8');
vm.runInNewContext(pageSource, {
  Page(config) {
    pageConfig = config;
  },
  require(request) {
    assert.equal(request, '../../data/tarot.js', `Unexpected module request: ${request}`);
    return tarotData;
  },
  xhs,
  console,
  Date,
  Math,
  Number,
  Object,
  setTimeout,
  clearTimeout,
}, { timeout: 5000 });

assert.ok(pageConfig, 'Page() registration was not captured');
const page = Object.assign({}, pageConfig, {
  data: JSON.parse(JSON.stringify(pageConfig.data)),
  setData(patch) {
    Object.assign(this.data, patch);
  },
});

page.onLoad();
page.chooseCategory({ currentTarget: { dataset: { id: 'general' } } });
page.onQuestionInput({ detail: { value: '这个项目下一步如何改进？' } });
page.selectSpread({ currentTarget: { dataset: { id: 'three_card' } } });
assert.equal(page.data.stage, 'reading');
assert.equal(page.data.readingCards.length, 3);
assert.equal(new Set(page.data.readingCards.map((item) => item.id)).size, 3, 'A draw must not contain duplicate cards');

page.revealAll();
assert.equal(page.data.allRevealed, true);
assert.ok(page.data.readingCards.every((item) => item.displayImage.startsWith('/assets/cards/')));
page.showFullReading();
assert.equal(page.data.stage, 'reveal');
assert.ok(page.data.summary.length > 20);
assert.ok(page.data.guidance.length >= 2);

page.saveReading();
assert.ok(xhsCalls.saved && xhsCalls.saved.cards.length === 3, 'Saving a reading must persist all drawn cards');
assert.ok(xhsCalls.toasts.includes('已保存到本机'));
assert.equal(page.onShareAppMessage().path, '/pages/index/index');
page.onUnload();

const templateSource = await readFile(join(miniRoot, 'pages', 'index', 'index.xhsml'), 'utf8');
const boundMethods = Array.from(templateSource.matchAll(/bind(?:tap|input)="([^"]+)"/g), (match) => match[1]);
for (const method of new Set(boundMethods)) {
  assert.equal(typeof pageConfig[method], 'function', `Template references missing handler ${method}`);
}

for (const tag of ['view', 'button', 'text', 'image', 'textarea']) {
  const openingCount = (templateSource.match(new RegExp(`<${tag}(?:\\s|>)`, 'g')) || []).length;
  const closingCount = (templateSource.match(new RegExp(`</${tag}>`, 'g')) || []).length;
  assert.equal(openingCount, closingCount, `Unbalanced <${tag}> tags`);
}

console.log('Xiaohongshu mini app validation passed');
console.log(`Pages: ${appConfig.pages.length}; cards: ${tarotData.tarotCards.length}; spreads: ${tarotData.spreads.length}`);
