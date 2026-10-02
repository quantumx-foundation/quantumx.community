"""Snapshot the Indian quantum jobs from our partner hub into the gig board.

Usage: python3 scripts/import-hub-jobs.py <jobs.json URL or file>
Pass the hub's jobs.json address, or a file if they send an export. Writes
src/content/hub-jobs.json.

QuantumX has permission from the hub to show these listings. Their terms still
apply: run this by hand to refresh (never on a schedule or from the site),
and keep the use non-commercial. Logos are not copied.
"""

import json
import re
import sys
import urllib.request
from pathlib import Path

OUT = Path("src/content/hub-jobs.json")

ORG_TYPES = {"startup": "Startup", "corporate": "Corporate", "academia": "Academia", "government": "Government"}

RULES = [
    ("Internship", r"\bintern(ship)?s?\b"),
    ("Part-time", r"\bpart[- ]time\b"),
    ("Contract", r"\b(contract|consultant|freelance)\b"),
    (
        "PhD or research",
        r"\b(jrf|srf|fellow(ship)?|ph\.?d|doctoral|post[- ]?doc(toral)?|research (associate|assistant|scientist|engineer)"
        r"|project (associate|assistant|scientist|engineer)|scientist|\bra\b)",
    ),
]


def role_type(role):
    """The hub doesn't record contract type, so it's read from the job title."""
    for label, pattern in RULES:
        if re.search(pattern, role, re.I):
            return label
    return "Full-time"


def load(source):
    if not source.startswith("http"):
        return json.loads(Path(source).read_text())
    request = urllib.request.Request(source, headers={"User-Agent": "Mozilla/5.0 (QuantumX Community import)"})
    return json.load(urllib.request.urlopen(request))


def main():
    if len(sys.argv) < 2:
        sys.exit("Usage: python3 scripts/import-hub-jobs.py <jobs.json URL or file>")
    data = load(sys.argv[1])
    jobs = []
    for j in data["items"]:
        if not j.get("role") or not j.get("org"):
            continue
        location = ", ".join(j.get("places") or []) or j.get("locationText") or ("Remote" if j.get("mode") == "Remote" else "India")
        jobs.append(
            {
                "role": j["role"].strip(),
                "company": j["org"].strip(),
                "orgType": ORG_TYPES.get(j.get("orgType") or ""),
                "location": location,
                "places": j.get("places") or [],
                "setup": j.get("mode") if j.get("mode") in ("On-site", "Hybrid", "Remote") else None,
                "type": role_type(j["role"]),
                "url": j.get("url"),
                "posted": j.get("posted"),
                "closes": j.get("deadline"),
                "pay": j.get("pay"),
                "source": "Hub",
            }
        )
    OUT.write_text(json.dumps({"built": data.get("built"), "jobs": jobs}, ensure_ascii=False, indent=1) + "\n")
    print(f"wrote {len(jobs)} jobs to {OUT} (hub built {data.get('built')})")


main()
