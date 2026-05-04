import http from "node:http";
import { parse } from "node:url";

import next from "next";
import { getHost, getPort } from "./config/runtime.mjs";

const port = getPort();
const host = getHost();

/** Do not pass `hostname`/`port` here — wrong values (e.g. 0.0.0.0) can break host matching and yield 404 on Render. */
const app = next({
  dev: false,
});

const handle = app.getRequestHandler();

try {
  await app.prepare();
  const server = http.createServer((req, res) => {
    const parsedUrl = parse(req.url ?? "/", true);
    void handle(req, res, parsedUrl);
  });

  server.listen(port, host, () => {
    console.log(`The Syntraa running on http://${host}:${port}`);
  });
} catch (error) {
  console.error("Failed to boot server:", error);
  process.exit(1);
}
