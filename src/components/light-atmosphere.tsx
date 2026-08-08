type LightAtmosphereProps = {
  variant?: "hero" | "quiet" | "page";
};

/**
 * Soft daylight field for heroes — cool, airy, no purple haze.
 * `page` is the richer treatment for inner-page heroes.
 */
export function LightAtmosphere({ variant = "hero" }: LightAtmosphereProps) {
  const isPage = variant === "page" || variant === "quiet";

  return (
    <>
      <div
        className={`pointer-events-none absolute inset-0 ${
          variant === "hero"
            ? "light-wash"
            : isPage
              ? "light-wash--page"
              : "light-wash--quiet"
        }`}
        aria-hidden="true"
      />

      {variant === "hero" ? (
        <>
          <div
            className="pointer-events-none absolute -top-24 left-[8%] h-[22rem] w-[22rem] rounded-full bg-brand-200/40 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute top-10 right-[-5%] h-[18rem] w-[18rem] rounded-full bg-sky-200/35 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="grid-lines-light pointer-events-none absolute inset-0 opacity-40"
            aria-hidden="true"
          />
        </>
      ) : (
        <>
          <div
            className="pointer-events-none absolute -top-32 left-[-6%] h-[26rem] w-[26rem] rounded-full bg-brand-200/50 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute top-0 right-[-8%] h-[22rem] w-[22rem] rounded-full bg-sky-200/45 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute bottom-[-20%] left-[35%] h-[18rem] w-[28rem] rounded-full bg-brand-100/70 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="page-mesh pointer-events-none absolute inset-0 opacity-[0.55]"
            aria-hidden="true"
          />
          <div
            className="grid-lines-light pointer-events-none absolute inset-0 opacity-[0.35]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-sand-50"
            aria-hidden="true"
          />
        </>
      )}
    </>
  );
}
