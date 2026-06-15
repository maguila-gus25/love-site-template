# The Story of Us — a romantic gift website

A single-page, mobile-first "love letter as a website": an animated, scrollable
keepsake you can personalize and give to someone special. Built as a portfolio
piece and shipped as a reusable, content-driven template — **edit one file and
the whole site updates.**

🔗 **Live demo:** _coming soon_ <!-- replace with your Vercel URL -->

> The demo uses placeholder content (`Partner One & Partner Two`). Drop in your
> own names, dates, photos, playlist and letter to make it yours.

---

## What it demonstrates

- **Next.js 16 (App Router)** with **React 19** and **TypeScript** end to end.
- **Rich, hand-built animations with [Motion](https://motion.dev)** — no UI kit:
  - Falling petals and staggered reveals on the hero.
  - A timeline and a gallery with a **shared-layout lightbox** (`layoutId`).
  - An **animated envelope** that opens in layers (seal → flap → letter slides out).
  - A **vinyl turntable** wired to the **Spotify iFrame API** — the disc spins and
    the tonearm tracks the current song, with play/prev/next controls.
  - A sequence of **spin-the-wheel** roulettes with easing-based deceleration that
    build a "date voucher" you can **export to PDF** on the fly.
- **Content-driven architecture** — every string, date, photo, song and the letter
  live in a single typed module (`content/content.ts`); components never hardcode copy.
- **Accessibility & polish** — semantic landmarks, `aria-label`s, keyboard `Esc`
  handling for overlays, and `prefers-reduced-motion` support.
- **On-demand code splitting** — `html2canvas` and `jspdf` are dynamically imported
  only when the PDF is generated, keeping the initial bundle lean.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.7 (App Router) |
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS 4 (CSS design tokens) |
| Animation | Motion v12 |
| PDF export | html2canvas + jsPDF (lazy-loaded) |
| Fonts | Fraunces, Caveat, Nunito (`next/font`) |
| Deploy | Vercel |

## Sections

`Hero` · `Timeline` · `Gallery` (lightbox) · `Reasons I love you` · `Days together`
counter · `Vinyl` player · animated `Letter` · `Date voucher` (spin wheels + PDF).

## Use it as a template

Everything you'd want to change lives in **`content/content.ts`**:

1. Set the couple names, start date and proposal date.
2. Fill in the timeline `moments` (mark the big ones with `anchor: true` — they're
   highlighted in pink).
3. Add your reasons in `thingsILove` and your songs in `vinylPlaylist`
   (Spotify track URIs).
4. Customize the `dateVoucherSteps` and write your `LETTER`.
5. Drop images into **`public/photos/`** (`01.jpg`, `02.jpg`, …) — until you do,
   the gallery shows a friendly "your photo here" placeholder, so the layout never
   breaks.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Other commands:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint
npx tsc --noEmit   # type-check
```

## Deploy

Deploys to [Vercel](https://vercel.com) with zero configuration — import the repo
(or run `vercel`) and it builds out of the box. No environment variables required.

## Project structure

```
.
├── app/
│   ├── globals.css       # design tokens (colors + fonts) and base styles
│   ├── layout.tsx        # root layout, fonts, metadata
│   └── page.tsx          # composes all sections in order
├── components/
│   ├── Hero.tsx          # opening section
│   ├── HeroPetals.tsx    # animated falling petals
│   ├── Counter.tsx       # days-together counter
│   ├── Timeline.tsx      # milestones timeline
│   ├── Gallery.tsx       # polaroid gallery with lightbox
│   ├── ThingsILove.tsx   # "reasons I love you" grid
│   ├── Vinyl.tsx         # turntable + Spotify iFrame API
│   ├── Letter.tsx        # animated envelope + letter
│   └── DateVoucher.tsx   # spin-the-wheel + PDF export
└── content/
    └── content.ts        # ALL editable content (names, dates, text, photos)
```

## License

MIT — free to use, fork and personalize.
