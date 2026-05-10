/**
 * Admin authentication — re-exports for route handlers and middleware.
 * Session crypto lives in `admin-session.ts` (Edge-safe). Password checks in `admin-credentials.ts` (Node only).
 */
export {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminSessionSecret,
  hasValidAdminSession,
  verifyAdminSessionToken,
} from "./admin-session";

export { verifyAdminCredentials } from "./admin-credentials";
