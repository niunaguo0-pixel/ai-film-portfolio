# AI Film Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个专业、高级、电影感的AI影视创作者单页作品网站，用于展示AI短剧与AI广告片，并提供个人介绍和联系信息。

**Architecture:** 使用无框架的静态单页架构，由语义化HTML承担页面结构、CSS自定义属性建立视觉系统、ES模块管理作品数据与交互。作品筛选与视频弹窗拆为可测试的纯函数和浏览器控制层，既能直接部署到GitHub Pages，也便于后续替换真实作品素材。

**Tech Stack:** HTML5、CSS3、原生JavaScript ES Modules、Node.js 24内置测试运行器、GitHub Pages兼容静态资源路径。

## Global Constraints

- 页面必须保持单页滚动结构，只包含顶部导航、首屏、作品展示、个人介绍、联系区和页脚。
- 作品分类只允许“AI短剧”和“AI广告片”。
- 不生成作品详情页、精选作品、AI微电影、AI视觉作品、专业能力、经历成果、简历下载或合作服务模块。
- 视频只能在用户主动点击后播放，且默认不自动播放声音。
- 页面必须适配电脑、平板和手机。
- 视觉基调必须专业、高级、克制、具有电影感，以深色背景和大幅作品画面为主。
- 网站不得依赖构建工具、前端框架或第三方JavaScript库。

---

## File Map

- `index.html`：单页语义结构、SEO元信息、导航、内容容器和视频弹窗。
- `styles.css`：颜色、字体、布局、作品卡片、响应式断点、动效和可访问性样式。
- `src/portfolio-data.js`：作品数据、分类常量、筛选与查找纯函数。
- `src/app.js`：作品渲染、分类切换、视频弹窗、导航和复制邮箱交互。
- `tests/site-structure.test.mjs`：验证页面必要模块、禁止模块和基础可访问性结构。
- `tests/portfolio-data.test.mjs`：验证作品分类、排序和ID查找逻辑。
- `tests/static-assets.test.mjs`：验证HTML引用的本地静态资源存在。
- `package.json`：Node内置测试命令与ES模块配置。
- `README.md`：本地预览、内容替换和GitHub Pages部署说明。

---

### Task 1: 建立可验证的单页骨架

**Files:**
- Create: `package.json`
- Create: `tests/site-structure.test.mjs`
- Create: `index.html`

**Interfaces:**
- Consumes: `docs/superpowers/specs/2026-09-03-ai-film-portfolio-design.md` 中锁定的模块范围。
- Produces: DOM锚点 `#home`、`#work`、`#about`、`#contact`；作品容器 `#work-grid`；筛选容器 `#work-filters`；弹窗 `#video-dialog`；模块脚本入口 `src/app.js`。

- [ ] **Step 1: 创建测试运行配置**

```json
{
  "name": "ai-film-portfolio",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test"
  }
}
```

- [ ] **Step 2: 编写失败的页面结构测试**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

test("包含所有必要的单页模块", () => {
  for (const id of ["home", "work", "about", "contact", "work-grid", "video-dialog"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
});

test("不包含已经排除的模块", () => {
  for (const label of ["精选作品", "AI微电影", "AI视觉作品", "专业能力", "经历与成果", "简历下载", "合作服务"]) {
    assert.doesNotMatch(html, new RegExp(label));
  }
});

test("导航和视频弹窗具备基础可访问性", () => {
  assert.match(html, /<nav[^>]+aria-label=["']主导航["']/);
  assert.match(html, /<dialog[^>]+id=["']video-dialog["']/);
  assert.match(html, /<video[^>]+controls/);
});
```

- [ ] **Step 3: 运行测试并确认失败**

Run: `npm test`

Expected: FAIL，错误包含 `ENOENT`，因为 `index.html` 尚未创建。

- [ ] **Step 4: 创建最小语义化页面结构**

`index.html` 必须包含：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="AI影视创作者个人作品集，展示AI短剧与AI广告片。">
    <title>AI影视创作者作品集</title>
    <link rel="stylesheet" href="./styles.css">
  </head>
  <body>
    <header class="site-header">
      <nav aria-label="主导航">
        <a href="#home">首页</a><a href="#work">作品</a><a href="#about">关于我</a><a href="#contact">联系我</a>
      </nav>
    </header>
    <main>
      <section id="home" aria-labelledby="hero-title">
        <p>AI FILM CREATOR</p>
        <h1 id="hero-title">用AI探索影像叙事的更多可能。</h1>
        <a href="#work">查看作品</a><a href="#contact">联系我</a>
      </section>
      <section id="work" aria-labelledby="work-title">
        <h2 id="work-title">作品</h2>
        <div id="work-filters" aria-label="作品分类"></div>
        <div id="work-grid" aria-live="polite"></div>
      </section>
      <section id="about" aria-labelledby="about-title">
        <h2 id="about-title">关于我</h2>
        <p>我是一名AI影视创作者，专注于AI短剧和AI广告片制作。</p>
      </section>
      <section id="contact" aria-labelledby="contact-title">
        <h2 id="contact-title">期待与你建立联系</h2>
        <a href="https://github.com/niunaguo0-pixel" target="_blank" rel="noreferrer">GitHub · niunaguo0-pixel</a>
      </section>
    </main>
    <footer><p>© 2026 AI Film Creator</p></footer>
    <dialog id="video-dialog" aria-labelledby="video-title">
      <button type="button" data-close-dialog aria-label="关闭视频">关闭</button>
      <h2 id="video-title"></h2>
      <video controls playsinline preload="metadata"></video>
    </dialog>
    <script type="module" src="./src/app.js"></script>
  </body>
</html>
```

- [ ] **Step 5: 运行测试并确认通过**

Run: `npm test`

Expected: 3 tests PASS。

- [ ] **Step 6: 提交单页骨架**

```bash
git add package.json tests/site-structure.test.mjs index.html
git commit -m "feat: add portfolio page structure"
```

---

### Task 2: 建立电影感视觉系统与响应式布局

**Files:**
- Create: `styles.css`
- Create: `tests/static-assets.test.mjs`
- Modify: `index.html`

**Interfaces:**
- Consumes: Task 1 的页面锚点和语义结构。
- Produces: 可复用CSS类 `.container`、`.section-heading`、`.work-card`、`.filter-button`、`.button`；断点 `960px` 和 `640px`；`prefers-reduced-motion` 降级规则。

- [ ] **Step 1: 编写失败的静态资源测试**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("HTML引用的本地样式和脚本均存在", async () => {
  const html = await readFile(resolve(root, "index.html"), "utf8");
  const paths = [...html.matchAll(/(?:href|src)=["']\.\/(?!#)([^"']+)["']/g)].map((match) => match[1]);
  assert.ok(paths.includes("styles.css"));
  assert.ok(paths.includes("src/app.js"));
  await Promise.all(paths.map((path) => access(resolve(root, path))));
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test`

Expected: FAIL，缺少 `styles.css` 和 `src/app.js`。

- [ ] **Step 3: 创建临时脚本入口并实现完整视觉样式**

先创建空的 `src/app.js` 以满足资源存在性，然后在 `styles.css` 中实现：

```css
:root {
  --color-bg: #090909;
  --color-surface: #121212;
  --color-text: #f2efe9;
  --color-muted: #a09d97;
  --color-accent: #b59668;
  --color-line: rgba(255, 255, 255, 0.12);
  --font-display: "Arial Narrow", "Microsoft YaHei", sans-serif;
  --font-body: Inter, "Microsoft YaHei", sans-serif;
  --content-width: 1280px;
  --section-space: clamp(5rem, 10vw, 10rem);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; background: var(--color-bg); }
body { margin: 0; color: var(--color-text); background: var(--color-bg); font-family: var(--font-body); }
img, video { display: block; max-width: 100%; }
a { color: inherit; }
.container { width: min(calc(100% - 3rem), var(--content-width)); margin-inline: auto; }
section { padding-block: var(--section-space); }
.site-header { position: fixed; inset: 0 0 auto; z-index: 20; backdrop-filter: blur(18px); }
.work-card { min-height: 28rem; border: 1px solid var(--color-line); background: var(--color-surface); }

@media (max-width: 960px) {
  .work-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 640px) {
  .container { width: min(calc(100% - 2rem), var(--content-width)); }
  .work-grid { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: 0.01ms !important; }
}
```

扩展上述基础规则，完成固定导航、全屏首屏、双栏作品网格、个人介绍双栏布局、联系区、页脚、键盘焦点、弹窗和悬停状态。所有正文对比度至少达到WCAG AA，按钮可点击区域至少为44×44像素。

- [ ] **Step 4: 为现有HTML元素应用统一类名和容器结构**

将每个区块内容包裹在 `.container` 中；为按钮应用 `.button`，为作品容器添加 `.work-grid`，为标题添加 `.section-heading`。不新增规格以外的内容模块。

- [ ] **Step 5: 运行测试并进行响应式检查**

Run: `npm test`

Expected: 所有测试PASS。

Manual: 在浏览器以 `1440×900`、`768×1024`、`390×844` 检查，无水平滚动；导航、标题、作品网格和联系信息均可见。

- [ ] **Step 6: 提交视觉系统**

```bash
git add styles.css src/app.js index.html tests/static-assets.test.mjs
git commit -m "feat: add cinematic responsive visual system"
```

---

### Task 3: 添加作品数据、分类筛选和卡片渲染

**Files:**
- Create: `src/portfolio-data.js`
- Create: `tests/portfolio-data.test.mjs`
- Modify: `src/app.js`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `#work-filters`、`#work-grid`、`.work-card`。
- Produces: `WORK_CATEGORIES: readonly string[]`、`portfolioItems: PortfolioItem[]`、`filterPortfolio(items, category): PortfolioItem[]`、`findPortfolioItem(items, id): PortfolioItem | undefined`。
- `PortfolioItem` fields: `{ id, title, category, coverUrl, duration, summary, videoUrl, accent, order }`，其中 `category` 只能是 `AI短剧` 或 `AI广告片`。

- [ ] **Step 1: 编写失败的数据逻辑测试**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { WORK_CATEGORIES, portfolioItems, filterPortfolio, findPortfolioItem } from "../src/portfolio-data.js";

test("作品只使用两个批准的分类", () => {
  assert.deepEqual(WORK_CATEGORIES, ["全部", "AI短剧", "AI广告片"]);
  assert.ok(portfolioItems.every((item) => ["AI短剧", "AI广告片"].includes(item.category)));
});

test("按分类筛选并保留展示顺序", () => {
  const dramas = filterPortfolio(portfolioItems, "AI短剧");
  assert.ok(dramas.length > 0);
  assert.ok(dramas.every((item) => item.category === "AI短剧"));
  assert.deepEqual(dramas.map((item) => item.order), [...dramas.map((item) => item.order)].sort((a, b) => a - b));
  assert.deepEqual(filterPortfolio(portfolioItems, "全部"), portfolioItems);
});

test("通过ID查找作品", () => {
  assert.equal(findPortfolioItem(portfolioItems, portfolioItems[0].id)?.title, portfolioItems[0].title);
  assert.equal(findPortfolioItem(portfolioItems, "missing"), undefined);
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test`

Expected: FAIL，错误包含 `ERR_MODULE_NOT_FOUND`。

- [ ] **Step 3: 实现作品数据和纯函数**

```js
export const WORK_CATEGORIES = Object.freeze(["全部", "AI短剧", "AI广告片"]);

export const portfolioItems = Object.freeze([
  {
    id: "drama-mist-letter",
    title: "雾城来信",
    category: "AI短剧",
    coverUrl: "",
    duration: "01:24",
    summary: "一封迟到多年的信，让两段被遗忘的记忆重新交汇。",
    videoUrl: "",
    accent: "#71685f",
    order: 1
  },
  {
    id: "drama-midnight-record",
    title: "午夜档案",
    category: "AI短剧",
    coverUrl: "",
    duration: "00:58",
    summary: "值夜员在旧档案中发现了一段仍在发生的影像。",
    videoUrl: "",
    accent: "#4f5960",
    order: 2
  },
  {
    id: "ad-afterglow",
    title: "余光",
    category: "AI广告片",
    coverUrl: "",
    duration: "00:30",
    summary: "以光影和材质变化呈现一支克制的品牌概念广告。",
    videoUrl: "",
    accent: "#8a6d4c",
    order: 3
  },
  {
    id: "ad-zero-coffee",
    title: "零点咖啡",
    category: "AI广告片",
    coverUrl: "",
    duration: "00:20",
    summary: "为夜晚仍在创造的人，保留一段清醒时刻。",
    videoUrl: "",
    accent: "#5d493c",
    order: 4
  }
]);

export function filterPortfolio(items, category) {
  const matchingItems = category === "全部" ? items : items.filter((item) => item.category === category);
  return [...matchingItems].sort((a, b) => a.order - b.order);
}

export function findPortfolioItem(items, id) {
  return items.find((item) => item.id === id);
}
```

- [ ] **Step 4: 实现筛选按钮和作品卡片渲染**

`src/app.js` 导入数据模块，使用 `data-category` 保存当前筛选值，使用 `data-work-id` 标记播放按钮。卡片封面在 `coverUrl` 为空时使用 `accent` 生成克制的渐变背景，不引用网络图片。

```js
import { WORK_CATEGORIES, portfolioItems, filterPortfolio } from "./portfolio-data.js";

const filters = document.querySelector("#work-filters");
const grid = document.querySelector("#work-grid");

function renderFilters(activeCategory = "全部") {
  filters.innerHTML = WORK_CATEGORIES.map((category) => `
    <button class="filter-button" type="button" data-category="${category}" aria-pressed="${category === activeCategory}">
      ${category}
    </button>`).join("");
}

function renderWorks(category = "全部") {
  grid.innerHTML = filterPortfolio(portfolioItems, category).map((item) => `
    <article class="work-card" style="--card-accent:${item.accent}">
      <button class="work-card__play" type="button" data-work-id="${item.id}" aria-label="播放《${item.title}》">
        ${item.coverUrl ? `<img class="work-card__cover" src="${item.coverUrl}" alt="" loading="lazy">` : ""}
        <span class="work-card__index">${item.category}</span>
        <span class="work-card__title">${item.title}</span>
        <span class="work-card__summary">${item.summary}</span>
        <span class="work-card__duration">${item.duration}</span>
      </button>
    </article>`).join("");
}
```

事件委托只绑定一次：点击筛选按钮后更新 `aria-pressed` 并重新渲染卡片。

- [ ] **Step 5: 运行测试并验证筛选交互**

Run: `npm test`

Expected: 7 tests PASS。

Manual: “全部”显示4项，“AI短剧”显示2项，“AI广告片”显示2项；键盘Tab可到达所有筛选和播放按钮。

- [ ] **Step 6: 提交作品展示功能**

```bash
git add src/portfolio-data.js src/app.js styles.css tests/portfolio-data.test.mjs
git commit -m "feat: add filterable portfolio gallery"
```

---

### Task 4: 完成视频弹窗、导航和联系入口

**Files:**
- Modify: `src/app.js`
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `tests/site-structure.test.mjs`

**Interfaces:**
- Consumes: `findPortfolioItem(items, id)`、`#video-dialog`、`data-work-id`、`data-close-dialog`。
- Produces: `openVideo(item): void`、`closeVideo(): void`；弹窗关闭后焦点回到触发按钮；GitHub联系入口使用安全的新标签页属性。

- [ ] **Step 1: 扩展失败的结构测试**

在 `tests/site-structure.test.mjs` 增加：

```js
test("联系和视频控件包含明确标签", () => {
  assert.match(html, /href=["']https:\/\/github\.com\/niunaguo0-pixel["'][^>]+target=["']_blank["'][^>]+rel=["']noreferrer["']/);
  assert.match(html, /data-close-dialog[^>]+aria-label=["']关闭视频["']/);
  assert.match(html, /<video[^>]+playsinline[^>]+preload=["']metadata["']/);
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test`

Expected: FAIL，联系区尚未包含完整的GitHub个人主页链接属性。

- [ ] **Step 3: 添加可用的联系入口**

在联系区使用用户已经提供的GitHub账号作为有效联系入口：

```html
<a class="contact-link" href="https://github.com/niunaguo0-pixel" target="_blank" rel="noreferrer">
  GitHub · niunaguo0-pixel
</a>
```

首屏姓名、个人介绍和外部主页集中保留在 `index.html`，避免引入后台或配置系统。后续获得用户公开邮箱或微信二维码后再追加对应入口。

- [ ] **Step 4: 实现视频弹窗**

```js
import { findPortfolioItem } from "./portfolio-data.js";

const dialog = document.querySelector("#video-dialog");
const video = dialog.querySelector("video");
const videoTitle = dialog.querySelector("#video-title");
let lastTrigger = null;

function openVideo(item, trigger) {
  lastTrigger = trigger;
  videoTitle.textContent = item.title;
  if (item.videoUrl) video.src = item.videoUrl;
  dialog.showModal();
}

function closeVideo() {
  video.pause();
  video.removeAttribute("src");
  video.load();
  dialog.close();
  lastTrigger?.focus();
}
```

当 `videoUrl` 为空时，弹窗显示“视频素材即将更新”，不调用 `video.play()`。监听关闭按钮、`Escape`、弹窗遮罩点击和原生 `close` 事件，保证媒体停止且焦点恢复。

- [ ] **Step 5: 实现导航状态**

使用 `IntersectionObserver` 更新当前导航链接的 `aria-current="location"`，不拦截浏览器原生锚点行为。GitHub联系入口保持浏览器原生链接行为。

- [ ] **Step 6: 运行自动化测试与键盘检查**

Run: `npm test`

Expected: 8 tests PASS。

Manual:

- 点击有视频地址的作品可打开弹窗，点击关闭、遮罩或按Escape均停止视频。
- 点击未配置视频地址的作品显示素材提示且不报错。
- 关闭弹窗后焦点返回原播放按钮。
- GitHub联系入口在新标签页打开正确的个人主页。
- Tab焦点顺序与页面视觉顺序一致。

- [ ] **Step 7: 提交交互功能**

```bash
git add src/app.js index.html styles.css tests/site-structure.test.mjs
git commit -m "feat: add accessible portfolio interactions"
```

---

### Task 5: 完成内容说明、发布检查与GitHub Pages准备

**Files:**
- Create: `README.md`
- Modify: `index.html`
- Modify: `src/portfolio-data.js`
- Modify: `styles.css`

**Interfaces:**
- Consumes: 完整静态网站和全部自动化测试。
- Produces: 无构建步骤的部署说明、内容替换清单和最终可发布版本。

- [ ] **Step 1: 集中检查页面元信息和个人内容**

确认 `index.html` 中只有以下四类需要用户后续替换的个人内容：页面标题、创作者姓名、个人简介、联系方式。确认 `src/portfolio-data.js` 中每个作品只包含规格允许的七个展示字段，以及用于渲染的内部ID和强调色。

- [ ] **Step 2: 编写README**

`README.md` 必须包含以下可执行说明：

```markdown
# AI Film Portfolio

## 本地预览

在项目目录运行：

```powershell
npx serve .
```

## 替换内容

- 在 `index.html` 修改姓名、个人介绍和联系方式。
- 在 `src/portfolio-data.js` 修改作品名称、分类、封面相关颜色、视频地址、时长和简介。
- 视频可使用仓库内相对路径，例如 `./assets/videos/example.mp4`，也可使用支持直接播放的HTTPS媒体地址。

## 发布

在GitHub仓库的 Settings → Pages 中，将 Source 设置为 Deploy from a branch，分支选择 `main`，目录选择 `/ (root)`。
```

- [ ] **Step 3: 运行全部自动化测试**

Run: `npm test`

Expected: 8 tests PASS，0 FAIL。

- [ ] **Step 4: 本地预览并完成视觉验收**

Run: `npx serve .`

Manual acceptance:

- 桌面端1440×900、平板端768×1024、手机端390×844均无水平滚动。
- 页面只出现批准的六个区域：导航、首屏、作品、关于我、联系和页脚。
- “AI短剧”和“AI广告片”筛选结果正确。
- 所有按钮具备可见焦点，文本与背景对比清晰。
- 未提供真实视频时展示友好提示，不出现损坏播放器。
- 浏览器控制台无错误。

- [ ] **Step 5: 检查Git变更并提交**

Run: `git diff --check`

Expected: 无输出。

```bash
git add README.md index.html src/portfolio-data.js styles.css
git commit -m "docs: add portfolio content and deployment guide"
```

- [ ] **Step 6: 推送并核对远程分支**

Run: `git push origin main`

Expected: `main -> main`，随后 `git status --short --branch` 显示 `## main...origin/main` 且无其他变更。
