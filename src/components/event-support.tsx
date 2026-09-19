import { Button, Tag, container } from "./ui";
import { LEAD_DAYS } from "@/lib/forms";

const covers = [
  { title: "Swag", body: "Stickers, badges and tees, shipped to you in time for the day." },
  { title: "Food and drinks", body: "Covered for the room, against a headcount we agree beforehand." },
  { title: "A speaker", body: "From the QuantumX network, online or in person, if you still need one." },
];

/**
 * Homepage panel for events that aren't ours: anyone running their own can ask
 * for swag and food. The lighter sibling of StartChapterBanner, which asks for
 * an ongoing commitment.
 */
export function EventSupportPanel() {
  return (
    <section aria-labelledby="support-title" className={`${container} py-16`}>
      <div className="grid border border-line bg-panel lg:grid-cols-[3fr_2fr]">
        <div className="relative p-6 pt-14 sm:p-10 sm:pt-16">
          <div className="absolute left-0 top-0">
            <Tag tone="soft">Event support</Tag>
          </div>
          <h2 id="support-title" className="text-3xl tracking-tight sm:text-4xl">
            Running your own quantum event? We&apos;ll back it.
          </h2>
          <p className="mt-4 max-w-lg text-muted">
            You don&apos;t need to be a chapter. If you&apos;re putting on a meetup, workshop or hackathon anywhere
            in the world, ask us for swag for the room and we&apos;ll cover the food. Free, and open to student
            clubs, labs and one-off organisers alike.
          </p>
          <div className="mt-10">
            <Button href="/events/support">Apply for support</Button>
          </div>
        </div>
        <ul className="divide-y divide-line border-t border-line lg:border-l lg:border-t-0">
          {covers.map((item) => (
            <li key={item.title} className="p-6 sm:p-8">
              <p className="font-pixel text-xs uppercase tracking-[0.2em] text-pink">{item.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
            </li>
          ))}
          <li className="p-6 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-wider text-muted">
              Ask at least {LEAD_DAYS} days before the date.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}
