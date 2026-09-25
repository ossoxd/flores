import test from "node:test";
import assert from "node:assert/strict";
import { resolveStaticRequest } from "../../src/core/staticPaths.js";

test("serves source files from the project root", () => {
  assert.equal(resolveStaticRequest("/src/main.js"), "src/main.js");
});

test("serves public assets without exposing the public prefix in the URL", () => {
  assert.equal(
    resolveStaticRequest("/assets/carrot-island/bunnyidle.png"),
    "public/assets/carrot-island/bunnyidle.png"
  );
});

test("serves the root URL as index.html", () => {
  assert.equal(resolveStaticRequest("/"), "index.html");
});
