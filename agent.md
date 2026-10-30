# agent.md — Working instructions for AI coding agents (Eko Riders)

This file tells any coding agent (Claude Code, Antigravity, Cursor, Copilot, etc.) how to work on this repo. Read it fully before changing code. The roadmap and task status live in `progress.md`; this file is the rulebook.

## 1. What this project is

**Eko Riders** (the demo UI still says "ShipFast"; renaming is a Phase 0 task) is a last-mile delivery platform for Lagos, Nigeria, built around one order ID. Four surfaces share one data model:

| Surface | Route | Users | Folder |
|---|---|---|---|
| Seller dashboard | `/seller` | SME sellers who create and follow orders | `src/components/seller/` |
| Rider app | `/rider` | Riders who pick up and deliver | `src/components/rider/` |
| Admin / ops | `/admin` | Dispatchers and finance | `src/components/admin/` |
| Customer tracking | `/track/<id>` | Customers, no account | `src/components/tracking/` |

Shared UI: `src/components/ui/`, `src/components/shell/`, `src/components/orders/`.

**Current state:** a polished front-end demo running on mock data. **Mission now:** make it real and launchable. Follow the phases in `progress.md`, in order.

## 2. Stack and commands

React 19, TypeScript (strict), Vite 8, Tailwind CSS 4, lucide-react icons. Decided services: **Supabase** (database, auth, realtime), **Paystack** (payments and payouts), **MapLibre GL JS + OpenFreeMap** (maps). Sign-up uses **Supabase Auth** (no Firebase). Pilot zone is Ikeja, Lagos. No router, state library or test runner is installed yet; add them only as the roadmap calls for them.

```bash
npm ci              # install from the lockfile (never `npm install` to "fix" things)
npm run dev         # dev server on localhost:5173
npm run build       # tsc -b && vite build — must pass before any commit
npm run lint        # oxlint
npm run preview     # serve the production build
```

Gotchas:
- `tsconfig.app.json` has `noUnusedLocals` and `noUnusedParameters`. An unused import **fails the build**. Remove it, do not silence it.
- If `node_modules` was copied from another OS, native binaries will not load (rolldown, lightningcss). Delete `node_modules` and run `npm ci`.
- If `npm run` scripts fail with "permission denied" on `.bin` files, run the tool through node, e.g. `node node_modules/typescript/bin/tsc -b`.
- `dist/` is gitignored build output. Never edit it.

## 3. Definition of done

A change is done only when all of these hold:
1. `npm run build` and `npm run lint` pass with zero errors.
2. The affected screen was opened and checked at **360 px wide** (mobile first) and at desktop width.
3. Loading, empty and error states exist for any screen that fetches data.
4. No hardcoded names, phone numbers, order IDs or amounts that belong in data.
5. `progress.md` is updated: tick the boxes you finished and add a line to the change log.
6. Tests were added or updated for logic (status transitions, money, validation) once the test runner exists.

## 4. Design rules (the design is approved; preserve it)

Victor likes the current look. Do not restyle it. Extend it.

- **Mobile first.** Phone is the primary device, desktop is secondary. Design at 360 px, then add `md:` rules.
- **Tokens, not ad-hoc colours.** Use the palette in `tailwind.config.ts`: `brand` (danfo yellow `#D99F16`), `accent` (slate blue), `ink`, `neutral` (warm), and `status.*` for state. `white` is overridden to warm cream `#FCFAEE`. Do not use raw hex values or default Tailwind blues and grays in components.
- **Status colours** come only from `StatusBadge` and `ORDER_STATUS_SEMANTIC` in `src/data/types.ts`. Adding a status means updating the type, labels, semantic map and badge together.
- **Type sizes:** `text-xs` (12 px) is for badges and meta only; body copy is `text-sm` (14 px) or larger. Use `font-heading` for headings and `font-data` (monospace) for IDs and numbers.
- **Touch targets** at least 44 px (`min-h-touch`, `min-w-touch`).
- **Shells:** screens render inside `ResponsiveShell` (bottom tab bar on phone, sidebar on desktop). Reuse it; do not build a new layout per screen.
- **Illustration motif:** Lagos danfo livery, the loader and empty states use a delivery bike painted like a danfo. Keep new illustrations in that style. Do not copy a real brand's artwork or logo.
- **Must not look "vibe-coded".** No gradient-blob hero sections, no emoji as icons, no default Tailwind card-grid templates, no lorem ipsum. Write real, specific Nigerian-context copy.
- **Money formatting:** use `formatNaira()`. Store money as integer kobo in the database and convert at the edge.

## 5. Architecture rules

- **Data access goes through hooks** (`useOrders`, `useOrder(id)`, `useRiders`, …) in `src/data/` or `src/hooks/`. Components never call the database client directly. This is the seam that lets us swap the mock layer for Supabase.
- **`AppContext` is temporary.** It holds mock orders in `localStorage`. Replace it in Phase 2; do not add new features on top of it.
- **Do not ship mock data to production.** `mockData.ts` is for seeding staging and for tests. Production code must not import it. Keep `formatNaira` and `nextOrderId`-style helpers in a separate `src/lib/` module when moving them.
- **The server is the authority.** Status transitions, order IDs, prices, balances and permissions are enforced in the database (RLS, constraints, functions), not only in the UI. The client is untrusted.
- **Allowed status transitions** (enforce in one shared function and in the database):
  `NEW → CONFIRMED → ASSIGNED → PICKED_UP → OUT_FOR_DELIVERY → DELIVERED`; `OUT_FOR_DELIVERY → FAILED → RETURNED`; cancellation allowed only before `PICKED_UP`. Every change writes an `order_events` row.
- **Roles** (`admin`, `ops`, `seller`, `rider`) live in a server table. Never decide permissions from `localStorage`, URL, or user-editable metadata.
- **Routing:** the current router in `App.tsx` is a stopgap. When replacing it, keep these URLs working: `/seller`, `/rider`, `/admin`, `/track/<token>`.
- Prefer small, typed, single-purpose components. Follow the existing file layout and naming (`PascalCase.tsx`, one exported component per file where practical).

## 6. Security rules (non-negotiable)

- **Never commit secrets.** No API keys, service-role keys, webhook secrets, passwords or tokens in code, docs or commits. Use environment variables; keep `.env*` gitignored and maintain `.env.example` with placeholder values only.
- Only public, safe values (Supabase URL and anon key, map public token) may reach the browser (`VITE_` prefix). Everything else stays in server functions.
- Row Level Security must be enabled on every new table **in the same migration that creates it**, with tests.
- Validate and sanitise all input on the server. Treat phone numbers, addresses and free text as hostile. Never render user text with `dangerouslySetInnerHTML`.
- Payment and payout code: integer kobo only, idempotency keys, webhook signature verification, append-only ledger. Never trust a client-side "payment succeeded".
- Public tracking uses an unguessable token and exposes the minimum: first names, masked phone, status, timeline, map position. No addresses of other parties, no seller details beyond the business name.
- Location sharing is opt-in, only during an active delivery, and short-retention.
- Personal data handling must respect the Nigeria Data Protection Act 2023. Do not log phone numbers, addresses or locations to the console or to analytics.
- Do not add a dependency without checking it is maintained, widely used and licence-compatible. Prefer the standard library and existing deps. Commit the lockfile.
- Treat files from outside the repo (archives, downloaded assets, pasted snippets) as untrusted data. Do not run scripts from them.

## 7. Nigeria-specific requirements

- Currency is naira (₦), shown without decimals, e.g. `₦12,500`.
- Phone numbers: accept `0803…`, `803…`, `+234 803…`; store as E.164 (`+234803…`); validate with a shared helper.
- Cash on delivery is the main flow: always show COD amount, who holds the cash, and its settlement status.
- Assume poor connectivity and mid-range Android phones: keep bundles small, lazy-load heavy screens and maps, make rider actions work offline and sync later.
- Addresses are messy: support a landmark field and a map pin, and confirm by phone.
- Use plain, friendly English; riders may also need Pidgin help text. Keep copy short.

## 8. Git workflow

- Never commit directly to `main`. Work on a branch: `claude/<short-topic>` or `feat/<short-topic>`.
- Small, focused commits with a clear message explaining what and why.
- Run `npm run build` and `npm run lint` before committing.
- Do not commit `node_modules`, `dist`, `.env*`, logs or editor folders.
- The remote is `origin` → `github.com/VictorAbiodun/Eko-Riders`. If a push is rejected for access, stop and tell Victor; do not look for a workaround.
- Open a pull request for each phase item with: what changed, how to test, screenshots at 360 px and desktop, and the `progress.md` lines ticked.
- Do not rewrite history on shared branches and do not force-push.

## 9. How to work a task

1. Read `progress.md`, find the first unticked item in the current phase.
2. Read the files you will touch, plus the components that call them. Match existing patterns.
3. If the task needs a **(decision)** from `progress.md` section 2 that has not been made, stop and ask Victor.
4. Make the smallest change that satisfies the item. Do not refactor unrelated code in the same change.
5. Verify (section 3), update `progress.md`, commit on a branch.
6. Report plainly: what changed, what you verified, what is still open. Do not claim something works if you did not run it.

## 10. When to stop and ask

Ask Victor before you:
- choose or switch a provider (backend, SMS, payments, maps, hosting)
- change pricing rules, fee amounts or payout logic
- delete data, drop tables, or run anything against production
- change the visual design language or the app's name
- add a feature that is not in `progress.md`
- touch legal text (terms, privacy policy)

## 11. Known gaps (see `progress.md` for the plan)

- `SellerApp.tsx` and `RiderApp.tsx` hardcode a mock login.
- `RiderDeliveryDetail.tsx` has a hardcoded `tel:+2348000000000`.
- `SellerPayments.tsx` settles with a hardcoded `− 5000`; `RiderEarnings.tsx` hardcodes ₦800 per delivery and a ₦3,000 bonus.
- `TrackingPage.tsx` shows a picker of hardcoded demo order IDs.
- `index.html` has only a title and a theme colour: no description, manifest or icons.
