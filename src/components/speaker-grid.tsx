import Image from "next/image";

export type Portrait = { name: string; title: string; slug: string };

/**
 * Portrait grid. Photos live at /images/<folder>/<slug>.webp.
 * Anything passed as children is appended as a final grid item. `eager` loads
 * the first few photos straight away, for a grid that opens the page.
 */
export function SpeakerGrid({
  items,
  folder = "speakers",
  eager = 0,
  children,
}: {
  items: Portrait[];
  folder?: string;
  eager?: number;
  children?: React.ReactNode;
}) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-6">
      {items.map((person, i) => (
        <li key={person.slug}>
          <div className="relative aspect-[4/5] overflow-hidden bg-panel">
            <Image
              src={`/images/${folder}/${person.slug}.webp`}
              alt={person.name}
              fill
              loading={i < eager ? "eager" : undefined}
              sizes="(min-width: 1024px) 180px, 45vw"
              className="object-cover object-[50%_30%]"
            />
          </div>
          <p className="mt-4 leading-snug">{person.name}</p>
          <p className="mt-1 text-sm leading-snug text-muted">{person.title}</p>
        </li>
      ))}
      {children}
    </ul>
  );
}
