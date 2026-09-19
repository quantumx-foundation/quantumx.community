import { PixelFlag } from "./pixel-flag";
import type { FlagCode } from "@/lib/site";

/** Tiny flag + city, or an "Online" marker. */
export function Place({ country, city }: { country: FlagCode | "online"; city: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      {country === "online" ? (
        <span aria-hidden className="font-pixel text-pink">
          ◎
        </span>
      ) : (
        <PixelFlag code={country} className="h-3 w-auto" />
      )}
      {city}
    </span>
  );
}
