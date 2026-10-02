"""Snapshot the Indian quantum jobs from the QETCI Ecosystem Hub into the gig board.

Usage: python3 scripts/import-qetci-jobs.py [path/to/jobs.json]
With no argument it downloads the hub's jobs.json once; pass a file instead if
QETCI sends an export. Writes src/content/qetci-jobs.json.

QuantumX has permission from QETCI to show these listings. Their terms still
apply: run this by hand to refresh (never on a schedule or from the site),
and keep the use non-commercial.
Logos are not copied; the board shows initials.
"""

import json
import re
import sys
import urllib.request
from pathlib import Path

URL = "https://ecosystem.qetci.org/data/jobs.json"
OUT = Path("src/content/qetci-jobs.json")

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
    if source and not source.startswith("http"):
        return json.loads(Path(source).read_text())
    request = urllib.request.Request(source or URL, headers={"User-Agent": "Mozilla/5.0 (QuantumX Community import)"})
    return json.load(urllib.request.urlopen(request))


def main():
    data = load(sys.argv[1] if len(sys.argv) > 1 else None)
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
                "source": "QETCI",
            }
        )
    OUT.write_text(json.dumps({"built": data.get("built"), "jobs": jobs}, ensure_ascii=False, indent=1) + "\n")
    print(f"wrote {len(jobs)} jobs to {OUT} (hub built {data.get('built')})")


main()
