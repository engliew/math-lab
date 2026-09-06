# Math Lab

A calm progressive maths practice app for **children ages 5 to 12**.

Math Lab walks a student from **Preschool** through **Year 1 to Year 6**. The path follows **Cambridge Primary Mathematics (0096)** — Number, Geometry and Measure, and Statistics and Probability — plus the official *prior experience for Stage 1* as the Preschool stage.

Built for **Eng Liew Lee / engliew**.

## How a lesson works

- Each topic has a bank of **1000 questions**.
- A lesson is **50 questions chosen at random** from that topic’s bank.
- Score **45 or more out of 50** to unlock the next topic.
- Score **under 45** and stay on the same topic; the next lesson draws a new random 50.

Progress is saved in the browser (`localStorage`) under the student’s name. No account server is required.

## What the MVP includes

- Full ordered topic list: Preschool + Years 1–6, with Cambridge Primary codes (`1Nc.01`, `5Np.01`, …).
- **Preschool — Counting objects 1 to 10** (`EY.Nc.01`) is fully playable: a seedable generator of 1000 varied questions (ten-frames, next/before, missing numbers, more/fewer, one more/one less).
- Later topics are listed and unlock in order; their question banks are not generated yet.
- Student flow: enter a name → resume the current topic → answer 50 one by one → see the score → advance or retry.

## Public site

**https://mathlab.engliew.xyz** (nginx on the engliew.xyz lab host).

Named source: [github.com/engliew/math-lab](https://github.com/engliew/math-lab).

## Run locally

You need Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43147](http://127.0.0.1:43147).

```bash
npm test    # question bank, random 50, pass/fail unlock
npm run build
npm start   # serves the static ./out folder
```

No environment variables. Progress is stored in the browser.

## Production (static export for nginx)

`npm run build` writes a static site to `./out` (`output: "export"`). That is what the lab host serves — not a Node process.

```bash
npm ci
npm run build
npm run pack:host   # dist/mathlab.engliew.xyz.tar.gz
```

Scott: extract the tarball to `/opt/mathlab.engliew.xyz` and use `deploy/nginx-mathlab.engliew.xyz.conf`. Full host notes: [deploy/README.md](deploy/README.md).

## Curriculum note

Math Lab is **not** an IGCSE or secondary course. Years here are **primary years**. Alignment is to Cambridge Primary Mathematics 0096 (Curriculum Framework v1.1), used as a public progression spine. Topic wording is our teaching sequence, not a Cambridge publication.

## Out of scope

Payments, teacher dashboards, and subjects other than maths.
