export function AllergensSection() {
  return (
    <section className="mt-12 pt-8 border-t border-[var(--color-cardboard-dark)]">
      <h2
        className="text-lg font-normal text-[var(--color-ink)] mb-3"
        style={{ fontFamily: "var(--font-script)" }}
      >
        Алергени
      </h2>
      <p className="text-sm text-[var(--color-ink-muted)]">
        Ве молиме известе го персоналот за какви било алергии пред нарачка.
      </p>
      <p className="text-sm text-[var(--color-ink-muted)] mt-2">
        Состојките кои се наведени со * се алергени.
      </p>
    </section>
  );
}
