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
  assert.equal(item.isDemo, false);
  assert.equal(item.poster, true);
  assert.equal(item.summary, "丧尸危机中，父亲马克为保护十岁的女儿莉莉，将即将尸变的自己锁进冷库，让她带着母亲留下的项链独自逃生。");
  assert.equal(item.duration, "01:01");
  assert.match(item.videoUrl, /dont-look-back-web\.mp4$/);
  assert.match(item.videoFallbackUrl, /dont-look-back-original\.mp4$/);
  assert.ok((await readFile(new URL(`../${item.coverUrl}`, import.meta.url))).length > 0);
});

test("归雁楼归入国内并保留用户介绍及媒体路径", async () => {
  const item = findPortfolioItem(portfolioItems, "guiyanlou");
  assert.equal(item.title, "归雁楼");
  assert.equal(item.region, "国内");
  assert.equal(item.isDemo, false);
  assert.equal(item.summary, "为追查母亲死于二十年前大火的真相，林夏搬进能靠转发短信转移灾祸的归雁楼，揭穿老住户守护的秘密，并将一场火灾转给他，逼他面对父辈留下的血债。");
  for (const path of [item.coverUrl, item.videoUrl]) {
    assert.ok((await readFile(new URL(`../${path}`, import.meta.url))).length > 0);
  }
});

test("酒店保洁短剧使用视频画面封面并保留视频地址", async () => {
  const item = findPortfolioItem(portfolioItems, "hotel-cleaner-ceo");
  assert.equal(item.region, "国内");
  assert.equal(item.isDemo, false);
  assert.match(item.coverUrl, /hotel-cleaner-ceo-frame\.webp$/);
  assert.notEqual(item.poster, true);
  assert.equal(item.verticalCover, true);
  assert.match(item.videoUrl, /hotel-cleaner-ceo-web\.mp4$/);
  assert.match(item.videoFallbackUrl, /hotel-cleaner-ceo-original\.mp4$/);
  assert.match(item.summary, /总裁陆青云卧底自家酒店/);
  assert.ok((await readFile(new URL(`../${item.coverUrl}`, import.meta.url))).length > 0);
});

test("作品只使用批准的分类且没有演示项目", () => {
  assert.deepEqual(WORK_CATEGORIES, ["全部", "AI短剧", "AI广告片", "其他"]);
  assert.ok(portfolioItems.every((item) => ["AI短剧", "AI广告片", "其他"].includes(item.category)));
  assert.ok(portfolioItems.every(item => item.isDemo === false));
  assert.equal(portfolioItems.length, 9);
});

test("两个正式广告片使用网页视频和原片备用地址", async () => {
  const speed = findPortfolioItem(portfolioItems, "ad-speed-prologue");
  const jewelry = findPortfolioItem(portfolioItems, "ad-light-is-her");
  assert.deepEqual([speed.title, jewelry.title], ["疾速序章", "光，即是她"]);
  assert.ok([speed, jewelry].every(item => item.category === "AI广告片" && item.coverUrl && item.isDemo === false));
  assert.match(speed.videoUrl, /speed-prologue-web\.mp4$/);
  assert.match(jewelry.videoUrl, /light-is-her-web\.mp4$/);
  assert.match(speed.videoFallbackUrl, /speed-prologue-original\.mp4$/);
  assert.match(jewelry.videoFallbackUrl, /light-is-her-original\.mp4$/);
  for (const item of [speed, jewelry]) {
    assert.ok((await readFile(new URL(`../${item.coverUrl}`, import.meta.url))).length > 0);
  }
});

test("按分类筛选并保留展示顺序", () => {
  const dramas = filterPortfolio(portfolioItems, "AI短剧");
  assert.ok(dramas.length > 0);
  assert.ok(dramas.every((item) => item.category === "AI短剧"));
  assert.deepEqual(dramas.map((item) => item.order), [...dramas.map((item) => item.order)].sort((a, b) => a - b));
  assert.deepEqual(filterPortfolio(portfolioItems, "全部"), portfolioItems);
});

test("其他分类包含三组完整图片项目", async () => {
  const items = filterPortfolio(portfolioItems, "其他");
  assert.deepEqual(items.map(item => item.title), ["猫咪 IP 与品牌空间设计", "女装电商视觉", "鎏金假面夜活动海报"]);
  assert.deepEqual(items.map(item => item.gallery.length), [6, 4, 1]);
  for (const item of items) {
    assert.equal(item.coverUrl, item.gallery[0]);
    for (const path of item.gallery) {
      assert.ok((await readFile(new URL(`../${path}`, import.meta.url))).length > 0);
    }
  }
});

test("通过ID查找作品", () => {
  assert.equal(findPortfolioItem(portfolioItems, portfolioItems[0].id)?.title, portfolioItems[0].title);
  assert.equal(findPortfolioItem(portfolioItems, "missing"), undefined);
});
