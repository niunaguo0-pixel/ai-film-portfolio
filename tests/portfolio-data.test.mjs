import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  WORK_CATEGORIES,
  portfolioItems,
  filterPortfolio,
  findPortfolioItem
} from "../src/portfolio-data.js";

test("国外短片使用真实海报和用户提供的介绍", async () => {
  const item = portfolioItems[0];
  assert.equal(item.title, "DON’T LOOK BACK");
  assert.equal(item.label, "国外短片");
  assert.equal(item.isDemo, false);
  assert.equal(item.poster, true);
  assert.equal(item.summary, "丧尸危机中，父亲马克为保护十岁的女儿莉莉，将即将尸变的自己锁进冷库，让她带着母亲留下的项链独自逃生。");
  assert.equal(item.duration, "01:01");
  assert.equal(item.videoUrl, "./assets/videos/dont-look-back-web.mp4");
  assert.ok((await readFile(new URL(`../${item.coverUrl}`, import.meta.url))).length > 0);
});

test("归雁楼归入国内并保留用户介绍及媒体路径", async () => {
  const item = findPortfolioItem(portfolioItems, "guiyanlou");
  assert.equal(item.title, "归雁楼");
  assert.equal(item.label, "国内短片");
  assert.equal(item.region, "国内");
  assert.equal(item.isDemo, false);
  assert.equal(item.summary, "为追查母亲死于二十年前大火的真相，林夏搬进能靠转发短信转移灾祸的归雁楼，揭穿老住户守护的秘密，并将一场火灾转给他，逼他面对父辈留下的血债。");
  for (const path of [item.coverUrl, item.videoUrl]) {
    assert.ok((await readFile(new URL(`../${path}`, import.meta.url))).length > 0);
  }
});

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
