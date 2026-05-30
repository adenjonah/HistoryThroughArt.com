interface PageHeadingProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  /** Heading alignment. Defaults to "center" (existing behavior). */
  align?: "left" | "center";
  className?: string;
}

/**
 * Shared page header (Nocturne): display-serif title over an optional
 * IBM-Plex-Mono gold eyebrow, with a short gold hairline as the site's
 * signature accent detail and an optional subtitle. Uses the AA contrast
 * tiers (--text-strong/--text-muted). `align` lets pages left-align (Gallery,
 * Map, Calendar) while About/How-To stay centered.
 */
export function PageHeading({ title, eyebrow, subtitle, align = "center", className = "" }: PageHeadingProps) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "text-center" : "text-left"} ${className}`}>
      {eyebrow && (
        <p
          className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--gold-color)] mb-3"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[var(--text-strong)]">
        {title}
      </h1>
      <div
        className={`${centered ? "mx-auto" : ""} mt-4 h-px w-16 bg-[var(--gold-color)]`}
        aria-hidden="true"
      />
      {subtitle && (
        <p
          className={`mt-5 text-base sm:text-lg text-[var(--text-muted)] max-w-2xl leading-relaxed ${
            centered ? "mx-auto" : ""
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default PageHeading;
