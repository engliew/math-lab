# Math Lab

A colourful progressive maths practice app for **children ages 5 to 12**.

Math Lab walks a student from **Preschool** through **Year 1 to Year 6**. The path follows **Cambridge Primary Mathematics (0096)** — Number, Geometry and Measure, and Statistics and Probability — plus the official *prior experience for Stage 1* as the Preschool stage.

Students **register and log in**. Progress is stored on the server (SQLite) so it follows them across sessions.

Built for **Eng Liew Lee / engliew**.

## How a lesson works

- Each topic has a bank of **1000 questions**.
- A lesson is **20 questions** chosen at random from that topic’s bank.
- Score **19 or more out of 20** to unlock the next topic.
- Score **15–18** and stay on the same topic with a **retry**. On that retry, **15 or more** unlocks the next topic.
- Score **under 15** and stay on the topic (the retry privilege is cleared).
- Type the answer and press **Enter** to check.

## What the MVP includes

- Full ordered topic list: Preschool + Years 1–6, with Cambridge Primary codes (`EY.Nc.01`, `1Nc.01`, `5Np.01`, `6Ss.03`, …).
- **Preschool — Counting objects 1 to 10** (`EY.Nc.01`) is fully playable: a seedable generator of 1000 varied questions (ten-frames, next/before, missing numbers, more/fewer, one more/one less).
- Later topics are listed and unlock in order; their question banks are not generated yet.
- Student flow: register → log in → current topic → 20 questions → score → advance or retry.

## Public site

**https://mathlab.engliew.xyz** (Node + nginx on the engliew.xyz lab host).

## Run locally

You need Node.js 22 or newer.

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43147](http://127.0.0.1:43147).

```bash
npm test      # curriculum, 1000-question bank, 20-question lessons, 19/15 bands
npm run migrate
npm run build
npm start     # next start on port 43147
```

Local SQLite is created at `./data/mathlab.sqlite`. No secrets required.

Do **not** set `AUTH_SECRET` (that belongs to Meridian). Math Lab uses its own SQLite sessions.

## Production (Scott / EC2 `/opt/mathlab`)

This release is a **Node standalone server**, not a static export.

**Migration is required** the first time you replace the old static site:

- New root: `/opt/mathlab` (old `/opt/mathlab.engliew.xyz` can be left unused).
- SQLite: `/opt/mathlab/data/mathlab.sqlite` — created on first start (`001_users_sessions_progress`).
- systemd unit `mathlab` on port `47821`.
- nginx `proxy_pass` instead of serving files.
- **Do not copy or change Meridian `AUTH_SECRET`.**

```bash
npm ci
npm test
npm run build
npm run pack:host   # dist/mathlab.tar.gz
```

Full host notes: [deploy/README.md](deploy/README.md).

## Curriculum note

Math Lab is **not** an IGCSE or secondary course. Years here are **primary years**. Alignment is to Cambridge Primary Mathematics 0096 (Curriculum Framework v1.1), used as a public progression spine. Topic wording is our teaching sequence, not a Cambridge publication.

## Out of scope

Payments, teacher dashboards, and subjects other than maths.
