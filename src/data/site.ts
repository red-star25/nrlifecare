/**
 * Deployment-level URL configuration.
 *
 * Kept separate from company.ts because that module exports a binding named
 * `process` (the enquiry process steps), which shadows Node's global and would
 * break the `process.env` lookups below.
 *
 * Every consumer of SITE_URL is a server component, so Vercel's server-only
 * variables are safe to read here.
 */

/**
 * The domain the site is ultimately meant to live on.
 *
 * Non-www by choice; Vercel redirects the www form to it. Changing this to the
 * www variant, or to the .com, is a one-line edit — every canonical URL, the
 * sitemap, robots.txt and the Open Graph tags derive from it.
 */
export const CANONICAL_SITE_URL = "https://nrlifecare.in";

/**
 * Coerces whatever was configured into a usable origin, or undefined.
 *
 * Hosting dashboards routinely hand back a bare hostname with no scheme, and
 * `new URL("example.vercel.app")` throws — which previously failed the entire
 * build. A missing scheme is an obvious intent, so assume https rather than
 * dying over it.
 */
function toOrigin(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;

  const withScheme = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    return new URL(withScheme).origin;
  } catch {
    return undefined;
  }
}

const configured = process.env.NEXT_PUBLIC_SITE_URL;
const fromConfig = toOrigin(configured);

if (configured?.trim() && !fromConfig) {
  console.warn(
    `[site] NEXT_PUBLIC_SITE_URL is not a usable URL: ${JSON.stringify(configured)}. Falling back.`,
  );
}

/**
 * Vercel supplies these without a scheme. Using them means a deployment that
 * has not been told its domain describes itself honestly as a preview, and is
 * therefore excluded from search — a safer default than silently claiming to
 * be the live site. Once a custom domain is attached,
 * VERCEL_PROJECT_PRODUCTION_URL becomes that domain and the site becomes
 * indexable on its own.
 */
const fromHost =
  toOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  toOrigin(process.env.VERCEL_URL);

/** Where this particular deployment is served from. */
export const SITE_URL = fromConfig ?? fromHost ?? CANONICAL_SITE_URL;

/**
 * Only the real domain should be crawlable. A staging copy that gets indexed
 * competes with the live site for the same queries.
 */
export const IS_CANONICAL_HOST = SITE_URL === CANONICAL_SITE_URL;
