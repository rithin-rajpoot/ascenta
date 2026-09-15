/**
 * Dependency-free in-memory rate limiter (PHASES.md Phase 12 — "API protection").
 *
 * Applied to sensitive endpoints (auth) to slow down credential stuffing and
 * brute-force attempts. It is intentionally simple: a single-instance counter
 * keyed by client IP. If the API is ever scaled horizontally this should be
 * replaced with a shared store (Redis) so limits are enforced globally.
 */
const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 30,
  message = "Too many requests. Please try again later.",
} = {}) => {
  const hits = new Map();

  // Opportunistic cleanup so the map cannot grow unbounded on a long-lived server.
  const prune = (now) => {
    if (hits.size < 1000) return;
    for (const [key, entry] of hits.entries()) {
      if (now > entry.resetAt) hits.delete(key);
    }
  };

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || req.socket?.remoteAddress || "unknown";

    prune(now);

    const entry = hits.get(key);

    if (!entry || now > entry.resetAt) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count += 1;

    if (entry.count > max) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      res.set("Retry-After", String(retryAfter));
      return res.status(429).json({
        success: false,
        message,
      });
    }

    return next();
  };
};

export default createRateLimiter;
