import assert from "node:assert/strict";
import { firefox } from "playwright";
import { portfolioItems } from "../src/portfolio-data.js";

const baseUrl = process.env.PORTFOLIO_URL ?? "http://127.0.0.1:4174/";
const browser = await firefox.launch({ headless: true });

try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, serviceWorkers: "block" });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));

    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.waitForFunction(
      expected => document.querySelectorAll(".work-card").length === expected,
      portfolioItems.length,
      { timeout: 20_000 }
    );
    assert.equal(await page.locator(".work-card").count(), portfolioItems.length);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    const hotelCard = page.getByRole("button", { name: "播放《我在酒店当保洁，顺手收了个总裁》" });
    const hotelLayout = await hotelCard.evaluate(card => {
      const image = card.querySelector("img");
      const cardRect = card.getBoundingClientRect();
      const imageRect = image.getBoundingClientRect();
      const articleRect = card.closest(".work-card").getBoundingClientRect();
      return {
        ratio: cardRect.width / cardRect.height,
        fillsCard: Math.abs(cardRect.width - imageRect.width) < 1 && Math.abs(cardRect.height - imageRect.height) < 1,
        fillsArticle: Math.abs(cardRect.width - articleRect.width) < 2.1 && Math.abs(cardRect.height - articleRect.height) < 2.1,
        objectFit: getComputedStyle(image).objectFit
      };
    });
    assert.ok(Math.abs(hotelLayout.ratio - 9 / 16) > 0.05);
    assert.equal(hotelLayout.fillsCard, true);
    assert.equal(hotelLayout.fillsArticle, true);
    assert.equal(hotelLayout.objectFit, "cover");
    const stacked = await page.evaluate(() => {
      const hotel = document.querySelector('[data-work-id="hotel-cleaner-ceo"]')?.closest(".work-card");
      const speed = document.querySelector('[data-work-id="ad-speed-prologue"]')?.closest(".work-card");
      const stack = hotel?.closest(".work-stack");
      return Boolean(stack && stack.children[0] === hotel && stack.children[1] === speed);
    });
    assert.equal(stacked, true);

    await page.getByRole("button", { name: "播放《DON’T LOOK BACK》" }).click();
    const video = page.locator("#video-dialog video");
    await video.waitFor({ state: "visible" });
    await page.waitForFunction(() => document.querySelector("#video-dialog video")?.readyState >= 1);
    assert.match(await video.getAttribute("src"), /assets\/videos\/dont-look-back-web\.mp4$/);
    assert.equal(errors.length, 0);
    await page.getByRole("button", { name: "关闭视频" }).click();

    await page.getByRole("button", { name: "其他", exact: true }).click();
    assert.equal(await page.locator(".work-card").count(), 3);
    await page.getByRole("button", { name: "查看《猫咪 IP 与品牌空间设计》" }).click();
    assert.equal(await page.locator("#image-gallery img").count(), 6);
    await page.getByRole("button", { name: "关闭视频" }).click();
    await context.close();
  }
} finally {
  await browser.close();
}

console.log("Firefox desktop/mobile smoke test passed");
