import Image from "next/image";

export type Portrait = { name: string; title: string; slug: string };

/**
 * Dithered portraits (Select-style) that reveal the real photo on hover.
 * Photos live at /images/<folder>/<slug>.webp, dithered copies in /images/<folder>/dither.
 * Anything passed as children is appended as a final grid item.
 */
export function SpeakerGrid({
  items,
  folder = "speakers",
  children,
}: {
  items: Portrait[];
  folder?: string;
  children?: React.ReactNode;
}) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-6">
      {items.map((person) => (
        <li key={person.slug} className="group">
          <div className="relative aspect-[4/5] overflow-hidden bg-panel">
            <Image
              src={`/images/${folder}/${person.slug}.webp`}
              alt=""
              fill
              sizes="(min-width: 1024px) 180px, 45vw"
              className="object-cover object-[50%_30%] grayscale transition duration-[3000ms] ease-out group-hover:grayscale-0"
            />
            <Image
              src={`/images/${folder}/dither/${person.slug}.png`}
              alt={person.name}
              fill
              unoptimized
              className="object-cover transition-opacity duration-[3000ms] ease-out [image-rendering:pixelated] group-hover:opacity-0"
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
