export function getPort() {
  const raw = process.env.PORT;
  const parsed = Number(raw);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  return 3000;
}

export function getHost() {
  return process.env.HOST || "0.0.0.0";
}
