interface PageHeadingProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  className?: string;
}

/**
 * Shared page header: display-serif title over an optional uppercase eyebrow,
 * with a short gold hairline as the site's signature accent detail and an
 * optional subtitle. Uses the AA contrast tiers (--text-strong/--text-muted).
 */
export function PageHeading({ title, eyebrow, subtitle, className = "" }: PageHeadingProps) {
  return (
    <div className={`text-center ${className}`}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)] mb-2">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[var(--text-strong)]">
        {title}
      </h1>
      <div className="mx-auto mt-4 h-px w-16 bg-[var(--gold-color)]" aria-hidden="true" />
      {subtitle && (
        <p className="mt-5 text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default PageHeading;
