# Tax & Structures Lab

An interactive learning environment for founders who want to understand how taxes
and business structures shape wealth — built around the *why*, not just current
rates.

> **Educational only — not advice.** Tax law is jurisdiction-specific, changes
> frequently, and depends on individual circumstances. The principles taught here
> are durable, but specific numbers, thresholds, and rules may be out of date.
> Always consult a qualified accountant or tax adviser before making real
> decisions.

## What's inside

Six sections, plus an onboarding flow and a global glossary:

1. **Foundations** — 10 interactive lessons on universal principles (limited
   liability, the three levers of tax efficiency, the retention principle,
   deductions, deferral, losses, pensions, incentives, and more).
2. **Structures** — sole trader, Ltd, LLP, holding company, FIC, PSC, partnership,
   trust. Each with an interactive cash flow diagram and a side-by-side compare
   view.
3. **Cash Flow Lab** — the centerpiece. Animated SVG cash flow with live
   recalculation. Adjust revenue, costs, salary, pension, R&D, extraction
   strategy. Save your own scenarios. Includes a multi-year mode that shows
   compounding retained earnings and an eventual exit (with optional BADR).
4. **UK Specifics** — 15 topic pages (corporation tax, IT/NI, dividends, VAT,
   R&D credits, EIS/SEIS, pensions, CGT, BADR, IR35, groups, ISAs, IHT, etc.),
   each labelled with the universal pattern it implements.
5. **Patterns** — 12 universal patterns plus a pattern-recognition exercise across
   UK / US / Canada / Singapore / Australia.
6. **Scenarios** — 10 worked-example walkthroughs and your own saved scenarios
   (with Markdown export).

All progress, notes, bookmarks and saved scenarios live in `localStorage`. There
is no backend.

## Tech stack

- **React 18 + TypeScript** (Vite)
- **Tailwind CSS**
- **D3** for cash flow diagrams, **Recharts** for comparison charts
- **react-router-dom** with `HashRouter` so it works on any static host

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default: `http://localhost:5173`).

Other scripts:

```bash
npm run build    # Type-check + production build into dist/
npm run preview  # Serve the production build locally
npm run lint     # tsc --noEmit
```

## Deploy to Vercel

The repo ships with a [`vercel.json`](vercel.json) that pre-configures the Vite
framework, build command, and SPA rewrites.

**Easiest path** — push to GitHub and import the repo at
[vercel.com/new](https://vercel.com/new). No env vars needed.

**CLI** — from the project root:

```bash
npx vercel        # preview deploy
npx vercel --prod # production
```

The build outputs to `dist/`, splits into three chunks (`react`, app code,
`charts`) so cold loads aren't a single large blob, and applies an immutable
cache header on `/assets/*`.

## Project layout

```
src/
  App.tsx                  Top-level router
  main.tsx                 Entry point
  components/              Sidebar, top bar, UI primitives, diagrams
  content/                 Lesson copy, structure metadata, UK topics, patterns
  lib/                     Tax engine, constants, formatters, glossary, storage
  pages/                   One folder per section (foundations, structures, lab,
                           uk, patterns, scenarios) plus Home / Onboarding /
                           Glossary / About
  state/                   App state context (LocalStorage-backed)
  styles/                  Tailwind entry
```

The tax calculation engine is in [`src/lib/tax.ts`](src/lib/tax.ts) — pure
functions for income tax (with PA taper), employee/employer NI, Class 4 NI,
dividend tax across bands, corporation tax with marginal relief, CGT, sole
trader, full Ltd round-trip with bisection-solved dividend extraction, and
multi-year compounding. All current UK figures are isolated in
[`src/lib/constants.ts`](src/lib/constants.ts) so they're easy to update each
budget.

## Three principles shaping every lesson

1. **Teach the why, not the rates.** Every current figure is labelled with the
   tax year it reflects. Principles persist; numbers change.
2. **Universal patterns first, jurisdiction second.** The UK is presented as
   one implementation of patterns shared across most developed economies.
3. **Interactive over passive.** Every major concept has a manipulable
   diagram, slider, or simulation.

## Disclaimers

- Numbers throughout the app are **illustrative**. Verify current rates with a
  qualified adviser before acting.
- Disclaimers appear on every relevant page, and a non-dismissable disclaimer
  has to be acknowledged during onboarding.
- The app is for the **United Kingdom**. Other jurisdictions are touched on in
  the Patterns section but not modelled in the simulator.

## License

Personal / educational use. No warranty of accuracy.
