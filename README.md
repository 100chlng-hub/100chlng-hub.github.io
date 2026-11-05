# 100Challenges Hub (`100chlng-hub.github.io`)

Official showcase hub for the **100Challenges Initiative** — committing to design, build, and publish 100 real-world, production-ready software repositories before the end of the year.

🌐 **Live Website**: [https://100chlng-hub.github.io](https://100chlng-hub.github.io)

---

## Challenge Progress

| Metric | Value |
| :--- | :--- |
| **Total Target** | 100 Autonomous Projects |
| **Completed** | 1 / 100 (1%) |
| **First Challenge** | [#001 — StreamPulse](https://github.com/100chlng-hub/001-streampulse) |
| **Author** | [Marco Silvestroni](https://github.com/marcosilvestroni) |

---

## How to Add a New Challenge

1. Open `challenges.json`.
2. Append a new project object to the array:
```json
{
  "id": 2,
  "slug": "002-your-project-name",
  "title": "Project Title",
  "tagline": "Short compelling summary",
  "status": "completed",
  "completedDate": "2026-11-XX",
  "category": "ai",
  "tags": ["Python", "FastAPI", "LLM", "Docker"],
  "description": "Comprehensive explanation of what the project solves.",
  "highlights": [
    "Key architectural decision or benchmark highlight",
    "Sub-10ms response time / offline capability",
    "Open source release"
  ],
  "repoUrl": "https://github.com/100chlng-hub/002-your-project-name",
  "demoUrl": "https://...",
  "docsUrl": "https://..."
}
```
3. Commit and push to `main`:
```bash
git add challenges.json
git commit -m "feat: add Challenge #002 - Project Title"
git push origin main
```
GitHub Actions automatically rebuilds and deploys the live hub in under 30 seconds.

---

## License
MIT License © 2026 Marco Silvestroni
