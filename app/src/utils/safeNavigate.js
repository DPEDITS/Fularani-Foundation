/**
 * Safe Navigation Utility — Redirect URL Allowlist Validation
 * 
 * Prevents open-redirect / phishing attacks by ensuring all navigation
 * targets are validated against a known allowlist of internal routes
 * before any redirect is executed.
 */

// Allowlist of all valid internal route prefixes from App.jsx
const ALLOWED_ROUTES = [
  "/",

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

/**
 * Validates whether a URL is a safe, allowed internal route.
 * 
 * Rejects:
 *  - Absolute URLs (https://evil.com)
 *  - Protocol-relative URLs (//evil.com)
 *  - javascript: URIs
 *  - data: URIs
 *  - Any path not matching the allowlist
 * 
 * @param {string} url - The URL to validate
 * @returns {boolean} - true if the URL is safe to redirect to
 */
export const isAllowedRoute = (url) => {
  if (!url || typeof url !== "string") return false;

  // Trim whitespace
  const trimmedUrl = url.trim();

  // Block empty strings
  if (trimmedUrl.length === 0) return false;

  // Block protocol-relative URLs (//evil.com)
  if (trimmedUrl.startsWith("//")) return false;

  // Block absolute URLs with any scheme (http:, https:, javascript:, data:, etc.)
  if (/^[a-zA-Z][a-zA-Z0-9+\-.]*:/.test(trimmedUrl)) return false;

  // Must start with "/" (relative path)
  if (!trimmedUrl.startsWith("/")) return false;

  // Extract the pathname (strip query string & hash)
  const pathname = trimmedUrl.split("?")[0].split("#")[0];

  // Check against allowlist — match exact or as prefix for parameterized routes
  return ALLOWED_ROUTES.some((route) => {
    if (route === "/") return pathname === "/";
    return pathname === route || pathname.startsWith(route + "/");
  });
};

/**
 * Safe wrapper for React Router's navigate() function.
 * Validates the target URL before navigating. Falls back to a safe route if blocked.
 * 
 * @param {Function} navigateFn - React Router's navigate function from useNavigate()
 * @param {string} target - The target URL to navigate to
 * @param {string} [fallback="/"] - Fallback route if target is blocked
 */
export const safeNavigate = (navigateFn, target, fallback = "/") => {
  if (isAllowedRoute(target)) {
    navigateFn(target);
  } else {
    console.warn(
      `[safeNavigate] Blocked redirect to disallowed URL: "${target}". Redirecting to "${fallback}".`
    );
    navigateFn(fallback);
  }
};

/**
 * Safe wrapper for window.location.href assignments.
 * Validates the target URL before redirecting. Falls back to a safe route if blocked.
 * 
 * @param {string} target - The target URL to redirect to
 * @param {string} [fallback="/"] - Fallback route if target is blocked
 */
export const safeLocationRedirect = (target, fallback = "/") => {
  if (isAllowedRoute(target)) {
    window.location.href = target;
  } else {
    console.warn(
      `[safeLocationRedirect] Blocked redirect to disallowed URL: "${target}". Redirecting to "${fallback}".`
    );
    window.location.href = fallback;
  }
};
