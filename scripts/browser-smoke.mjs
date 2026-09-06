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
    assert.equal(await page.locator(".work-card").count(), portfolioItems.length);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);

    await page.getByRole("button", { name: "播放《DON’T LOOK BACK》" }).click();
    const video = page.locator("#video-dialog video");
    await video.waitFor({ state: "visible" });
    await page.waitForFunction(() => document.querySelector("#video-dialog video")?.readyState >= 1);
    assert.match(await video.getAttribute("src"), /assets\/videos\/dont-look-back-web\.mp4$/);
    assert.equal(errors.length, 0);
    await page.getByRole("button", { name: "关闭视频" }).click();
    await context.close();
  }
} finally {
  await browser.close();
}

console.log("Firefox desktop/mobile smoke test passed");
