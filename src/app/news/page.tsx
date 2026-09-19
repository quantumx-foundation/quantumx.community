import type { Metadata } from "next";
import { NewsCard } from "@/components/news-card";
import { PageHero, container } from "@/components/ui";
import { news } from "@/content/news";

export const metadata: Metadata = {
  title: "News",
  description: "Announcements, launches and dispatches from the QuantumX Community, from Bengaluru to London and Abu Dhabi.",
  alternates: { canonical: "/news" },
};

export default function NewsPage() {
  return (
    <>
      <PageHero eyebrow="News" title="Dispatches from the community">
        Meetups, launches, winners and the trips where new chapters start.
      </PageHero>
      <section className={`${container} grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-3`}>
        {news.map((item) => (
          <NewsCard key={item.url} item={item} />
        ))}
      </section>
    </>
  );
}
