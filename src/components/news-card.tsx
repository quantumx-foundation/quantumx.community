import Image from "next/image";
import { PixelFlag } from "./pixel-flag";
import { Tag } from "./ui";
import type { NewsItem } from "@/content/news";

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col border border-line bg-panel transition-colors hover:border-dim"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={item.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="object-cover grayscale contrast-110 transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
        />
        <div className="absolute left-0 top-0">
          <Tag tone={item.kind === "On the road" ? "pink" : item.kind === "Launch" ? "soft" : "pink"}>{item.kind}</Tag>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted">
          {item.country && <PixelFlag code={item.country} className="h-3 w-auto" />}
          {item.displayDate}
        </p>
        <h3 className="mt-3 text-lg leading-snug group-hover:text-pink">{item.title}</h3>
        <p className="mt-2 flex-1 text-sm text-muted">{item.summary}</p>
        <p className="mt-5 font-pixel text-xs uppercase tracking-[0.2em] text-pink">Read the post ↗</p>
      </div>
    </a>
  );
}
