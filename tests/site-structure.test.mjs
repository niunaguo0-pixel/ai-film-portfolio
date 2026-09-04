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

test("联系和视频控件包含明确标签", () => {
  assert.match(html, /href=["']https:\/\/github\.com\/niunaguo0-pixel["'][^>]+target=["']_blank["'][^>]+rel=["']noreferrer["']/);
  assert.match(html, /data-close-dialog[^>]+aria-label=["']关闭视频["']/);
  assert.match(html, /<video[^>]+playsinline[^>]+preload=["']metadata["']/);
  assert.doesNotMatch(html, /<video[^>]+autoplay/);
});

test("未配置视频时提供可读状态且默认隐藏空播放器", () => {
  assert.match(html, /id=["']video-status["'][^>]+role=["']status["'][^>]*>视频素材即将更新</);
  assert.match(html, /<video[^>]+hidden/);
});
