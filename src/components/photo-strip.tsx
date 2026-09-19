import Image from "next/image";
import { moments } from "@/content/moments";

/** Full-bleed marquee of event photos that scrolls on its own. Black and white until hovered. */
export function PhotoStrip() {
  return (
    <div className="group overflow-hidden">
      <div className="marquee flex w-max group-hover:[animation-play-state:paused]">
        {[0, 1].map((copy) =>
          moments.map((photo, i) => (
            <Image
              key={`${copy}-${photo.src}`}
              src={photo.src}
              width={photo.width}
              height={photo.height}
              alt={copy === 0 ? `Moment from a QuantumX community event, photo ${i + 1}` : ""}
              aria-hidden={copy === 1 || undefined}
              sizes="(min-width: 640px) 560px, 80vw"
              className="mr-4 h-64 w-auto shrink-0 object-cover grayscale contrast-110 transition duration-500 hover:grayscale-0 sm:mr-8 sm:h-96"
            />
          )),
        )}
      </div>
    </div>
  );
}
