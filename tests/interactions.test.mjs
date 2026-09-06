import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import * as data from "../src/portfolio-data.js";

// Browser DOM/media are external to Node. This fixture records their observable
// state while evaluating the real application event handlers without dependencies.
class Element {
  constructor() {
    this.children = []; this.attributes = {}; this.dataset = {};
    this.listeners = {}; this.style = { overflow: "auto", setProperty() {} };
    this.hidden = false; this.open = false; this.isConnected = true;
  }
  append(...nodes) { this.children.push(...nodes); }
  prepend(node) { this.children.unshift(node); }
  replaceChildren(node) { this.children = node ? node.children : []; }
  setAttribute(key, value) { this.attributes[key] = value; }
  getAttribute(key) { return this.attributes[key] ?? null; }
  removeAttribute(key) { delete this.attributes[key]; }
  set src(value) { this.setAttribute("src", value); }
  addEventListener(type, callback) { (this.listeners[type] ??= []).push(callback); }
  emit(type, event = {}) { for (const callback of this.listeners[type] ?? []) callback({ target: this, ...event }); }
  querySelector(selector) { return this.selectors?.[selector]; }
  querySelectorAll() { return this.children; }
  contains() { return true; }
  closest() { return this; }
  focus() { this.focused = true; }
  pause() { this.paused = true; }
  load() { this.loaded = true; }
  showModal() { this.open = true; }
  close() { this.open = false; this.emit("close"); }
  getBoundingClientRect() { return this.rect ?? { top: 100, bottom: 500, left: 100, right: 500 }; }
}

const source = (await readFile(new URL("../src/app.js", import.meta.url), "utf8"))
  .replace(/^import .*?;\s*/s, "");

function setup(withObserver = true) {
  const nodes = Object.fromEntries(["#region-filters", "#work-filters", "#work-grid", "#video-dialog", "video", "#video-title", "#video-status", "#video-feedback", "#video-retry", "#image-gallery", "[data-close-dialog]"].map(key => [key, new Element()]));
  nodes["#video-dialog"].selectors = nodes;
  const sections = ["home", "work", "about", "contact"].map((id, index) => Object.assign(new Element(), { id, rect: { top: index * 1000, bottom: (index + 1) * 1000 } }));
  const links = sections.map(section => { const link = new Element(); link.setAttribute("href", `#${section.id}`); return link; });
  const document = {
    body: new Element(), activeElement: new Element(), documentElement: { scrollHeight: 4000 },
    querySelector: selector => nodes[selector],
    querySelectorAll: selector => selector.includes("nav") ? links : sections,
    createElement: () => new Element(), createDocumentFragment: () => new Element(),
  };
  const window = new Element(); window.innerHeight = 800; window.scrollY = 0;
  let observe;
  const context = { ...data, document, window, IntersectionObserver: withObserver ? class {
    constructor(callback) { observe = callback; }
    observe() {}
  } : undefined };
  vm.runInNewContext(source, context);
  return { nodes, document, window, context, links, sections, notify: () => observe?.([]) };
}

test("空视频作品打开状态弹窗并锁定滚动", () => {
  const { nodes, document, context } = setup();
  context.openVideo({ title: "待更新作品", videoUrl: "" }, new Element());
  assert.equal(nodes["#video-dialog"].open, true);
  assert.equal(nodes["#video-status"].textContent, "视频素材即将更新");
  assert.equal(nodes.video.hidden, true);
  assert.equal(nodes.video.getAttribute("src"), null);
  assert.equal(document.body.style.overflow, "hidden");
});

for (const closeAction of ["button", "cancel", "backdrop", "native"]) {
  test(`${closeAction}关闭停止媒体、释放资源并恢复焦点和滚动`, () => {
    const { nodes, document, context } = setup();
    assert.equal(typeof context.openVideo, "function");
    const trigger = new Element();
    context.openVideo({ title: "真实视频", videoUrl: "/sample.mp4" }, trigger);
    assert.equal(nodes.video.getAttribute("src"), "/sample.mp4");
    assert.equal(nodes.video.hidden, false);
    assert.equal(nodes["#video-feedback"].hidden, false);
    if (closeAction === "button") nodes["[data-close-dialog]"].emit("click");
    if (closeAction === "cancel") nodes["#video-dialog"].emit("cancel", { preventDefault() {} });
    if (closeAction === "backdrop") nodes["#video-dialog"].emit("click", { clientX: 0, clientY: 0 });
    if (closeAction === "native") nodes["#video-dialog"].close();
    assert.equal(nodes["#video-dialog"].open, false);
    assert.equal(nodes.video.paused, true);
    assert.equal(nodes.video.getAttribute("src"), null);
    assert.equal(document.body.style.overflow, "auto");
    assert.equal(trigger.focused, true);
  });
}

test("视频载入失败后隐藏播放器并显示友好提示", () => {
  const { nodes, context } = setup();
  assert.equal(typeof context.openVideo, "function");
  context.openVideo({ title: "视频", videoUrl: "/missing.mp4" }, new Element());
  nodes.video.emit("error");
  assert.equal(nodes.video.hidden, true);
  assert.equal(nodes["#video-feedback"].hidden, false);
  assert.equal(nodes["#video-retry"].hidden, false);
  assert.match(nodes["#video-status"].textContent, /暂时无法播放/);
});

test("主视频失败时自动切换备用源", () => {
  const { nodes, context } = setup();
  context.openVideo({ title: "视频", videoUrl: "/web.mp4", videoFallbackUrl: "/original.mp4" }, new Element());
  nodes.video.emit("error");
  assert.equal(nodes.video.getAttribute("src"), "/original.mp4");
  assert.equal(nodes.video.hidden, false);
  assert.match(nodes["#video-status"].textContent, /备用视频源/);
});

test("图片项目打开完整作品图集", () => {
  const { nodes, context } = setup();
  const item = data.portfolioItems.find(work => work.gallery?.length);
  context.openVideo(item, new Element());
  assert.equal(nodes["#video-dialog"].open, true);
  assert.equal(nodes.video.hidden, true);
  assert.equal(nodes["#video-feedback"].hidden, true);
  assert.equal(nodes["#image-gallery"].hidden, false);
  assert.equal(nodes["#image-gallery"].children[0].children.length, item.gallery.length);
});

test("导航更新当前区域并在页面底部选择联系区域", () => {
  const { links, sections, window, notify } = setup();
  assert.equal(links[0].getAttribute("aria-current"), "location");
  sections[0].rect = { top: -1000, bottom: 0 };
  sections[1].rect = { top: 0, bottom: 1000 };
  notify();
  assert.equal(links[1].getAttribute("aria-current"), "location");
  assert.equal(links[0].getAttribute("aria-current"), null);
  window.scrollY = 3200;
  window.emit("scroll");
  assert.equal(links[3].getAttribute("aria-current"), "location");
});

test("缺少IntersectionObserver时作品和分类仍正常渲染", () => {
  const { nodes } = setup(false);
  assert.equal(nodes["#work-grid"].children.length, data.portfolioItems.length - 1);
  assert.equal(nodes["#work-filters"].children.length, 4);
});

test("AI短剧地区筛选与切换重置", () => {
  const { nodes } = setup();
  const main = nodes["#work-filters"];
  const regions = nodes["#region-filters"];
  main.emit("click", { target: main.children[1] });
  assert.equal(regions.hidden, false);
  regions.emit("click", { target: regions.children[1] });
  assert.equal(nodes["#work-grid"].children.length, 2);
  assert.equal(nodes["#work-grid"].children[0].children[0].dataset.workId, "dont-look-back");
  regions.emit("click", { target: regions.children[2] });
  assert.equal(nodes["#work-grid"].children.length, 2);
  assert.equal(nodes["#work-grid"].children[0].children[0].dataset.workId, "guiyanlou");
  main.emit("click", { target: main.children[2] });
  assert.equal(regions.hidden, true);
  assert.equal(regions.children[0].getAttribute("aria-pressed"), "true");
  main.emit("click", { target: main.children[3] });
  assert.equal(nodes["#work-grid"].children.length, 3);
});

test("酒店短剧与疾速序章在全部视图中叠放", () => {
  const { nodes } = setup();
  const stack = nodes["#work-grid"].children.find(child => child.className === "work-stack");
  assert.ok(stack);
  assert.equal(stack.children[0].children[0].dataset.workId, "hotel-cleaner-ceo");
  assert.equal(stack.children[1].children[0].dataset.workId, "ad-speed-prologue");
});

test("每张作品卡片都有对应的查看提示", () => {
  const { nodes } = setup();
  const cards = nodes["#work-grid"].children.flatMap(child => child.className === "work-stack" ? child.children : [child]);
  cards.forEach((card, index) => {
    const playButton = card.children[0];
    const expected = data.portfolioItems[index].gallery?.length ? "查看作品 ↗" : "查看影片 ↗";
    assert.ok(playButton.children.some(child => child.textContent === expected));
    assert.ok(playButton.children.every(child => child.className !== "work-card__duration"));
    assert.ok(playButton.children.every(child => child.className !== "work-card__index"));
  });
});
