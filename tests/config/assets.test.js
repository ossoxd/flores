import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import { join } from "node:path";
import { describe, it } from "node:test";
import { ASSETS } from "../../src/config/assets.js";

describe("asset catalog", () => {
  it("separa assets originales de assets personalizados", () => {
    assert.match(ASSETS.tileset.url, /^\/assets\/carrot-island\//);
    assert.match(ASSETS.rabbit.url, /^\/assets\/carrot-island\//);
    assert.match(ASSETS.girlfriend.url, /^data:image\/png;base64,/);
    assert.match(ASSETS.yellowFlower.url, /^\/assets\/custom\/flowers\//);
  });

  it("no registra zanahorias", () => {
    assert.equal(Object.keys(ASSETS).join(" ").toLowerCase().includes("carrot"), false);
  });

  it("apunta a los archivos originales del entorno y del conejo", async () => {
    for (const asset of [ASSETS.tileset, ASSETS.rabbit, ASSETS.rabbitRun]) {
      await access(join(process.cwd(), "public", decodeURIComponent(asset.url)));
    }
  });

  it('loads Micky idle, eight-frame run and portrait sheets from this project', () => {
    for (const asset of [ASSETS.mickyIdle, ASSETS.mickyRun, ASSETS.mickyPortraits]) {
      assert.match(asset.url, /^data:image\/png;base64,/);
    }
    assert.equal(Buffer.from(ASSETS.mickyRun.url.split(',')[1], 'base64').subarray(16, 24).readUInt32BE(0), 512);
  });
});
