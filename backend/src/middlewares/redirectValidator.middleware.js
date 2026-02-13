/**
 * Redirect URL Validator Middleware
 * 
 * Validates any `redirect` or `returnTo` query parameter against
 * an allowlist of safe internal routes. Use this on any backend
 * endpoint that may accept a user-supplied redirect target.
 * 
 * Usage:
 *   import { validateRedirectUrl } from "./middlewares/redirectValidator.middleware.js";
 *   router.get("/callback", validateRedirectUrl, (req, res) => {
 *     res.redirect(req.safeRedirectUrl);
 *   });
 */

import logger from "../utils/logger.js";

const ALLOWED_ROUTES = [
  "/",
  "/about",
  "/missions",
  "/csr-partnership",
  "/gallery",
  "/donor-login",
  "/donor-register",
  "/contact",
  "/volunteer-login",
  "/volunteer-register",
  "/volunteer-dashboard",
  "/donor-dashboard",
  "/admin-dashboard",
  "/stories",
];

const isAllowedRedirect = (url) => {
  if (!url || typeof url !== "string") return false;

  const trimmed = url.trim();
  if (trimmed.length === 0) return false;
  if (trimmed.startsWith("//")) return false;
  if (/^[a-zA-Z][a-zA-Z0-9+\-.]*:/.test(trimmed)) return false;
  if (!trimmed.startsWith("/")) return false;

  const pathname = trimmed.split("?")[0].split("#")[0];

  return ALLOWED_ROUTES.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname === route || pathname.startsWith(route + "/");
  });
};

export const validateRedirectUrl = (req, res, next) => {
  const redirectParam = req.query.redirect || req.query.returnTo || req.body?.redirect;

  if (redirectParam) {
    if (isAllowedRedirect(redirectParam)) {
      req.safeRedirectUrl = redirectParam;
    } else {
      logger.warn(
        `[redirectValidator] Blocked unsafe redirect URL: "${redirectParam}" from ${req.ip}`
      );
      req.safeRedirectUrl = "/";
    }
  } else {
    req.safeRedirectUrl = "/";
  }

  next();
};
