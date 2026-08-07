/**
 * Deployment-level URL configuration.
 *
 * Kept separate from company.ts because that module exports a binding named
 * `process` (the enquiry process steps), which shadows Node's global and would
 * break the `process.env` lookup below.
 */

/** The domain the site is ultimately meant to live on. */
export const CANONICAL_SITE_URL = "https://www.nrlifecare.com";

/**
 * Where this particular deployment is served from. Staging builds set
 * NEXT_PUBLIC_SITE_URL so canonical tags, the sitemap and Open Graph URLs
 * describe the deployment you are actually looking at.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || CANONICAL_SITE_URL
).replace(/\/$/, "");

/**
 * Only the real domain should be crawlable. A staging copy that gets indexed
 * competes with the live site for the same queries.
 */
export const IS_CANONICAL_HOST = SITE_URL === CANONICAL_SITE_URL;
