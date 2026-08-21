# Chael

The world's most beautiful AI skin companion for Black women — a conversation-first
Next.js 15 application built from the CHAEL frontend design specification.

## Getting started

This project was generated without network access, so dependencies are **not**
installed yet. To run it locally:

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS, using CSS variables for the light/dark ("blush paper" /
  "chocolate") theme defined in `app/globals.css`
- **Animation:** Framer Motion — ease-out only, 200–350ms, nothing bounces
- **Icons:** Lucide React
- **Forms:** React Hook Form
- **State:** Zustand (`lib/store.ts`)
- **Theme switching:** next-themes

## Structure

```
app/
  page.tsx                     landing (splash → editorial hero)
  (marketing)/
    signup/                    create account
    signin/                    sign in
    consent/                   privacy consent toggles
  (app)/                       authenticated app shell (3-column desktop / bottom nav mobile)
    layout.tsx
    chat/
      page.tsx                 main conversation — upload, quick actions, results recap
      assessment/page.tsx      step-by-step skin assessment
      analyzing/page.tsx       animated analysis checklist
      results/page.tsx         full skin summary
    care/
      page.tsx                 dermatologists, saved, appointments, resources, emergency
      [id]/page.tsx            doctor profile
      [id]/book/page.tsx       booking + confirmation
    you/
      page.tsx                 progress, streak, goals
      timeline/page.tsx        check-in history
      photos/page.tsx          photo comparison
      settings/page.tsx        settings index
      settings/edit-profile/   profile + notifications
      settings/privacy/        consent + data controls
components/
  ui/                          Button, Input, Toggle, Card, Badge, ProgressBar, Avatar
  shell/                       BottomNav, CareRail, YouRail, AppShell, nav-items
  chat/                        bubbles, composer, message list, results card, assessment radio
  care/                        DoctorCard, ArticleCard
  you/                         ProgressChart (lightweight inline SVG, no chart library)
lib/
  types.ts                     shared TypeScript types
  mock-data.ts                 doctors, articles, results, chat + progress data
  store.ts                     Zustand stores: chat, assessment, app (consent/saved)
  utils.ts                     cn() class helper, date/time formatting
```

## Design tokens

Defined as CSS variables in `app/globals.css` and mapped into `tailwind.config.ts`:

| Token | Light | Dark |
| --- | --- | --- |
| Background | `#fdf0f4` | `#3e2723` |
| Surface | `#fffaf8` | `#4b332f` |
| Accent | `#f4c9d6` | `#f4c9d6` |
| Text | `#1a0f0d` | `#f6eee8` |
| Secondary text | `#6d4c41` | `rgba(255,245,240,.72)` |

Typography: **Cormorant Garamond** for display/headlines only, **DM Sans** everywhere
else (both loaded via `next/font/google`, so they'll fetch on first build).

Radius scale: buttons 18px, inputs 20px, photos/containers 24px, chat input pill (999px).

## Photography

Photo placeholders currently use `picsum.photos` seeded URLs so the app renders without
network calls to a real image library. Per the brand spec, replace every image source
in `lib/mock-data.ts` and the landing hero (`app/page.tsx`) with licensed editorial
photography of real Black skin before shipping — no AI-generated faces, stock hospital
imagery, or illustrations.

## Notes

- All flows use mock data and simulated delays (`setTimeout`) to mimic the "expensive"
  motion and analysis pacing described in the spec — wire these up to real endpoints
  by replacing the actions in `lib/store.ts`.
- Consent and saved-doctor state persist to `localStorage` via Zustand's `persist`
  middleware (`chael-app-store`).
- Chat, assessment answers, and results are in-memory only per session; connect a
  backend to persist history across visits.
