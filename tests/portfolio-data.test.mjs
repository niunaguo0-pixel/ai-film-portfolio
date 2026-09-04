import test from "node:test";
import assert from "node:assert/strict";
import {
  WORK_CATEGORIES,
  portfolioItems,
  filterPortfolio,
  findPortfolioItem
} from "../src/portfolio-data.js";

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
