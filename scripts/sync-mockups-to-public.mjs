/**
 * Copies `Syntraa MockUp/*` → `public/mockups/<slug>/img-XXX.ext` for stable URLs on Render/mobile.
 * Re-run after adding artwork: npm run sync-mockups
 */
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();

const SOURCE_DIRS = [
  { from: ["Syntraa MockUp", "Hair care"], to: "hair-care" },
  { from: ["Syntraa MockUp", "Body  care"], to: "body-care" },
  { from: ["Syntraa MockUp", "FaceCare"], to: "face-care" },
  { from: ["Syntraa MockUp", "Facial's"], to: "facials" },
  { from: ["Syntraa MockUp", "Serum's"], to: "serums" },
];

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function main() {
  const destRoot = path.join(ROOT, "public", "mockups");
  await fs.rm(destRoot, { recursive: true, force: true });
  await fs.mkdir(destRoot, { recursive: true });

  /** @type {Record<string, string[]>} */
  const manifest = {};

  for (const { from, to } of SOURCE_DIRS) {
    const srcDir = path.join(ROOT, ...from);
    const outDir = path.join(destRoot, to);
    manifest[to] = [];

    /** @type {import('fs').Dirent[]} */
    let entries;
    try {
      entries = await fs.readdir(srcDir, { withFileTypes: true });
    } catch (err) {
      console.warn(
        "[sync-mockups] skip missing dir:",
        srcDir,
        err instanceof Error ? err.message : err,
      );
      continue;
    }

    await fs.mkdir(outDir, { recursive: true });
    const files = entries.filter((d) => d.isFile()).map((d) => d.name).sort();

    let n = 0;
    for (const name of files) {
      const ext = path.extname(name).toLowerCase();
      if (!ALLOWED_EXT.has(ext)) continue;
      n += 1;
      const safe = `img-${String(n).padStart(3, "0")}${ext}`;
      await fs.copyFile(path.join(srcDir, name), path.join(outDir, safe));
      const urlPath = "/" + ["mockups", to, safe].join("/");
      manifest[to].push(urlPath);
    }
  }

  await fs.writeFile(path.join(destRoot, "manifest.json"), JSON.stringify(manifest, null, 2));

  console.log("[sync-mockups] Done →", destRoot);
  for (const [k, urls] of Object.entries(manifest)) {
    console.log(`  ${k}: ${urls.length} files`);
  }
}

await main();
