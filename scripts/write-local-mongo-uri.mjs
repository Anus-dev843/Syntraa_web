import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const envLocal = path.join(root, ".env.local");

const URI_LINE = "MONGODB_URI=mongodb://127.0.0.1:27017/syntraa";

function main() {
  if (!fs.existsSync(envLocal)) {
    fs.writeFileSync(
      envLocal,
      `# Local MongoDB — start with: npm run db:up\n${URI_LINE}\n`,
      "utf8",
    );
    console.log("Created .env.local with local MONGODB_URI.");
    console.log("Run: npm run db:up   then restart: npm run dev");
    return;
  }
  const text = fs.readFileSync(envLocal, "utf8");
  if (/^\s*MONGODB_URI\s*=/m.test(text)) {
    console.log(".env.local already defines MONGODB_URI — not changed.");
    return;
  }
  const sep = text.endsWith("\n") ? "" : "\n";
  fs.appendFileSync(
    envLocal,
    `${sep}\n# Local MongoDB — npm run db:up\n${URI_LINE}\n`,
    "utf8",
  );
  console.log("Appended local MONGODB_URI to .env.local.");
  console.log("Run: npm run db:up   then restart: npm run dev");
}

main();
