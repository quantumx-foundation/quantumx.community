# Marketing review: quantumx.community

Feedback from the marketing head on https://quantumx.community/, what was built for each item, and what's still needed from the team.

Status key: ⬜ not done yet, ✅ done.

Everything below is built and checked locally (desktop and mobile). It goes live with the next deploy.

---

## Things to add

### 1. Community faces (mods and volunteers) ✅

**Ask:** Show the faces of people who are part of the community. Invite community members to volunteer regularly (like mods) and give them a name or role, so they share it with friends who then want to join.

**Built:** A "The crew" section on the homepage (after Speakers) and a full `/crew` page, plus an event volunteer signup form. Signups are emailed to events@quantumx.community and the volunteer gets an acknowledgement. Until the first people are added, both show a "Be the first face here" card that links to the form.

**To add someone:** add them to `src/content/crew.ts`, drop their photo in `public/images/crew/<slug>.webp`, and run `python3 scripts/dither.py`.

**Still needed:**
- ⬜ First crew members: name, role, city and photo for each.
- ⬜ Confirm we can deliver what the page promises volunteers: a crew role on Discord, swag, and a first look at events.

### 2. Resources section ✅

**Ask:** A resources section grouped by area: papers, tools, recorded workshops and so on. We keep adding to it over time.

**Built:** A `/resources` page (in the main nav) with 35 hand-picked resources across six areas: Foundations, Algorithms, Hardware and error correction, Quantum machine learning, Cryptography, and Tools and SDKs. Each one has a type (Course, Book, Paper, Tool, Video), a level and a one-line note, and the page filters by type. Every link was checked. A "Suggest a resource" button emails events@.

**To add one:** add it to `src/content/resources.ts`.

**Still needed:**
- ⬜ Links to recordings of past QuantumX workshops. They go in as type "Workshop recording" and get a highlighted tag.

### 3. World map with locations ✅

**Ask:** A world map showing where we are.

**Built:** A pixel world map on the homepage (Chapters section) and the `/chapters` page. Live chapters pulse in pink, forming ones are hollow. It reads from the chapter list, so a new chapter shows up on the map automatically.

### 4. Fortune cookie ✅

**Ask:** An interactive fortune cookie. Click it, it cracks open and shows a random line.

**Built:** A "Quantum fortune" section on the homepage (after Programs). Click the pixel cookie and it cracks in two, and a fortune slides out with lucky numbers. Click again for a new one. 30 quantum-themed fortunes.

**To edit the fortunes:** `src/content/fortunes.ts`.

### 5. Funny GIFs ✅

**Ask:** Add funny GIFs somewhere in the middle of the page.

**Built:** "Quantum, but make it funny", in the middle of the homepage (between the pillars and Chapters). Three looping pixel animations we made ourselves, so there's no copyright question:
- Schrödinger's cat flickering in a box until you hover to observe it.
- A hardware job queue that only ever gets longer.
- The word SUPERPOSITION decohering into noise ("my focus, twenty minutes into the linear algebra").

**To add real GIFs:** drop them in `public/images/gifs/` and list them in `src/content/gifs.ts`. They appear next to the loops. Use our own clips (event moments, memes we made).

### 6. Gig Board (careers) ✅

**Ask:** A go-to page for openings across the quantum industry, not just QuantumX.

**Built:** A `/gigs` job board (in the main nav) with search and filters for role type (full-time, internship, PhD or research, contract), organisation type (startup, corporate, academia, government) and location (cities, or remote/hybrid). Each filter shows how many roles it would leave. Every role links out to the original listing, and roles drop off after their closing date.

It launched with 147 open Indian quantum roles from the [QETCI Indian Quantum Ecosystem Hub](https://ecosystem.qetci.org/jobs.html) and shown with their permission. Companies can also post directly through the "Post a role" form. Each post is emailed to events@ for a check, and the poster gets an acknowledgement.

**To refresh QETCI's roles:** run `python3 scripts/import-qetci-jobs.py` by hand and commit the result. Their terms ban automated crawling, so don't put it on a schedule.

**To add a role posted to us:** add it to `src/content/gigs.ts` after checking the listing is real.

**Still needed:**
- ⬜ Keep QETCI's permission in writing (email is fine), and check it covers showing their jobs on our site without their citation (their public terms require one).

---

## Things to change

### 1. Instagram link to the foundation page ✅

Changed from `instagram.com/quantumx.school` to [instagram.com/quantumx.foundation](https://www.instagram.com/quantumx.foundation/) (the "QuantumX" account).

### 2. Nothing else to change ✅

"The website is amazing!"

### 3. Community branding colour ✅

**Ask:** Think about Community branding. Pink is the favourite, yellow is also an option.

**Done:** Pink stays the brand colour. Yellow is added as a secondary accent and used only on the fortune cookie, so we can see how it feels before using it anywhere else.

**Still needed:**
- ⬜ Her call: keep yellow as that one-off accent, use it more widely, or drop it.
