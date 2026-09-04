import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Removing a linked local asset would leave the served page with a broken request.
test("HTML引用的本地样式和脚本均存在", async () => {
  const html = await readFile(resolve(root, "index.html"), "utf8");
  const paths = [...html.matchAll(/(?:href|src)=["']\.\/(?!#)([^"']+)["']/g)].map((match) => match[1]);
  assert.ok(paths.includes("styles.css"));
  assert.ok(paths.includes("src/app.js"));
  await Promise.all(paths.map((path) => access(resolve(root, path))));
});
