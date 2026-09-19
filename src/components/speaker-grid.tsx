import Image from "next/image";
import type { Speaker } from "@/content/speakers";

/** Dithered portraits (Select-style) that reveal the real photo on hover. */
export function SpeakerGrid({ items }: { items: Speaker[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-6">
      {items.map((speaker) => (
        <li key={speaker.slug} className="group">
          <div className="relative aspect-[4/5] overflow-hidden bg-panel">
            <Image
              src={`/images/speakers/${speaker.slug}.webp`}
              alt=""
              fill
              sizes="(min-width: 1024px) 180px, 45vw"
              className="object-cover object-[50%_30%] grayscale transition duration-[3000ms] ease-out group-hover:grayscale-0"
            />
            <Image
              src={`/images/speakers/dither/${speaker.slug}.png`}
              alt={speaker.name}
              fill
              unoptimized
              className="object-cover transition-opacity duration-[3000ms] ease-out [image-rendering:pixelated] group-hover:opacity-0"
            />
          </div>
          <p className="mt-4 leading-snug">{speaker.name}</p>
          <p className="mt-1 text-sm leading-snug text-muted">{speaker.title}</p>
        </li>
      ))}
    </ul>
  );
}
