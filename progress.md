# Eko Riders — Road to a User-Ready Launch

Last updated: 2026-10-30
Owner: Victor
Goal: take the current demo (mock data, fake logins, localStorage) to a real product that sellers, riders, admins and customers can install on their phones and use for live deliveries in Lagos.

Legend: `[x]` done · `[ ]` to do · `[~]` partly done · **(decision)** needs Victor's call before work starts

---

## 1. Where we are today (audited 2026-10-30)

### What exists and is good
- [x] Design system: danfo-yellow + ink palette, warm cream neutrals, semantic status colours, 44px touch targets (`tailwind.config.ts`, `src/index.css`)
- [x] Four surfaces, all mobile-first with a desktop sidebar layout where it makes sense:
  - Seller (`/seller`): home, orders, order detail, create order, payments
  - Rider (`/rider`): home, deliveries, delivery detail, earnings
  - Admin (`/admin`): operations, orders, riders, sellers, payments, returns
  - Customer tracking (`/track/ORD-xxxxxx`)
- [x] Landing page that lets you pick a demo, danfo loader, empty states, skeletons
- [x] Order lifecycle modelled: NEW → CONFIRMED → ASSIGNED → PICKED_UP → OUT_FOR_DELIVERY → DELIVERED, plus FAILED and RETURNED (`src/data/types.ts`)
- [x] Vite production build works

### What is fake or missing (this is the work)
| Area | Today | Needed |
|---|---|---|
| Data | `mockData.ts` in memory + `localStorage` key `shipfast_demo_orders`. Riders and sellers are static. | Real database, shared by all users |
| Login | None. `SellerApp` hardcodes "Adunni Okafor", `RiderApp` hardcodes "Ibrahim" | Real accounts, roles, sessions |
| Sync | Cross-tab only, via the `storage` event | Realtime across devices |
| Money | Rider pay is hardcoded (₦800 per delivery, ₦3,000 bonus above 5). Seller "settled" is `COD collected − 5000`. Admin "settle" is component state. | Real ledger, real payouts |
| Map | `MapGraphic.tsx` is a decorative SVG | Real map, rider location, ETA |
| Rider phone | `tel:+2348000000000` hardcoded in `RiderDeliveryDetail.tsx` | Real phone from the rider record |
| Tracking page | Has a picker of hardcoded demo order IDs | Public tracking by unguessable token only |
| Routing | Home-made `pathname` check in `App.tsx`, links do full page loads | A router, plus host rewrites so deep links work |
| Install | No manifest, no service worker, no icons beyond `favicon.svg` | Installable PWA |
| Settings | Placeholder screens | Real profile and account settings |
| Quality | Build, typecheck and lint pass (lint has 4 non-blocking warnings). No tests. No error handling or error boundary. | Tests, error handling |
| Repo | `.git` remote is `VictorAbiodun/Eko-Riders`, app UI is still branded "ShipFast" | Rename UI to Eko Riders |

---

## 2. Decisions

Decided 2026-10-30:

| Topic | Decision | Notes |
|---|---|---|
| Product name | **Eko Riders** | The demo UI still says "ShipFast"; renaming is a Phase 0 task |
| Backend | **Supabase** | Postgres, Auth, Realtime, Storage, Row Level Security. Separate staging and production projects |
| Payments | **Paystack** (picked for ease of use) | No setup or monthly fee. Pays only when money moves: local cards and transfers cost 1.5% + ₦100 (the ₦100 is waived under ₦2,500, fee capped at ₦2,000); payouts cost ₦10 (up to ₦5,000), ₦25 (₦5,001–₦50,000), ₦50 (above that). Source: paystack.com/pricing, checked 2026-10-30. "Free" means free to start, not free per transaction |
| Sign-up | **Supabase Auth** (Victor first preferred Firebase, then agreed) | One auth system. Firebase phone-SMS is not on its free plan (needs pay-as-you-go Blaze with a billing card) and would add a second login system. Email and Google sign-in are free; phone OTP is added through the Send SMS hook with a Nigerian SMS provider once SMS budget is agreed |
| Pilot zone | **Ikeja** | Mainland; includes Computer Village for electronics sellers. Recruit 3–5 sellers and 5–10 riders there |
| Maps | **MapLibre GL JS** (open source) with **OpenFreeMap** tiles over OpenStreetMap data | No API key, no bill. OpenFreeMap says its public service is "as-is" with no guarantee, so keep the tile URL in config and plan to self-host or switch if usage grows. Address entry in v1 is pin-drop plus a typed landmark, with no paid geocoder |

Still open:

| Topic | Status |
|---|---|
| Legal documents | **Open, explained below.** Needed before the pilot, not before Phase 0 |

### What "legal documents" means here
These are the written rules that protect Eko Riders and its users. For this app:
1. **Terms of Service**: what Eko Riders does and does not promise. Who pays when a parcel is lost or damaged, how COD cash is held and paid out, what happens on a failed delivery, delivery and return fees, when an account can be suspended.
2. **Privacy Policy**: what personal data the app collects (phone numbers, addresses, rider location), why, who can see it, how long it is kept, and how someone asks for it to be deleted. Nigeria's Data Protection Act 2023 expects this.
3. **Rider agreement and seller agreement**: one page each. Riders are usually independent contractors with duties for handling cash and parcels; sellers agree to packaging, prohibited items and COD rules.

Victor is not a lawyer and neither is this document: draft all four, then have a Nigerian lawyer review them before real users sign up. Paystack will also ask for business details to approve a live account, so check their current requirements and whether the business needs CAC registration.

---

## 3. Roadmap

Work in order. Each phase ends in something you can demo. Do not start a phase until the previous exit criteria are met.

### Phase 0 — Clean foundation (about 1 day)
- [ ] Push the local branch `claude/admin-empty-states-build-fix` to the repo (needs GitHub access; see agent.md)
- [x] Fix the 12 `noUnusedLocals` errors so `npm run build` passes (done 2026-10-30)
- [x] Delete dead code in `App.tsx`; the token reference now lives at `/dev/design-system`, development builds only (done)
- [x] Remove the ngrok host from `vite.config.ts`; a tunnel host can be set with `DEV_ALLOWED_HOST` (done)
- [x] Rename ShipFast to **Eko Riders** everywhere (done; the demo's localStorage key is now `eko_riders_demo_orders`, so saved demo orders reset once) (`package.json` name, `index.html` title, headers, landing page, loader copy, README)
- [~] Added `typecheck` script and `.github/workflows/ci.yml` (lint, typecheck, build). The `test` script waits for the test runner in Phase 6
- [x] Added `.env.example`; `.env*` is gitignored except the example
- [ ] Add Prettier or Oxlint format rules so diffs stay small

**Exit:** green CI on every push. Local build, typecheck and lint are green; CI itself runs once the branch is pushed. Still open in this phase: pushing the branch (needs repo access) and the formatter.

### Phase 1 — Backend, data model and auth (about 1 week)
- [ ] Create the Supabase project (separate **staging** and **production** projects)
- [ ] Design and migrate the schema (see section 4); keep migrations in `supabase/migrations/` under version control
- [ ] Turn on Row Level Security for **every** table before any data goes in
- [ ] Auth: Supabase Auth (decided). Phone OTP through the Send SMS hook and a Nigerian SMS provider (Termii or similar) for sellers and riders; email + password + 2FA for admins
- [ ] Roles: `admin`, `ops`, `seller`, `rider`. Roles live in a server-side table, never in client-editable metadata
- [ ] Invite flow for riders and admins; seller self-signup with admin approval
- [ ] Seed script that loads the current mock data into **staging only**
- [ ] Generate TypeScript types from the database and replace `src/data/types.ts` hand-written types where they overlap
- [ ] Write RLS tests: a seller cannot read another seller's orders; a rider only sees assigned orders; the public can read tracking data only through a token

**Exit:** four test accounts (admin, seller, rider, customer) exist in staging and the RLS tests prove they cannot read each other's data.

### Phase 2 — Wire the apps to real data (about 1–2 weeks)
- [ ] Replace `AppContext` + `localStorage` with a data layer (TanStack Query + Supabase client, or equivalent). Keep components talking to hooks like `useOrders()`, not to the database directly
- [ ] Login screens and sign-out for each role; route guards by role; remove "mock login" in `SellerApp` and `RiderApp`
- [ ] Seller: create order (server-generated order ID, validation, Nigerian phone format), list, detail, cancel before pickup
- [ ] Admin: assign rider, change status, view all orders, manage riders and sellers, approve sellers
- [ ] Rider: accept, pick up, mark delivered or failed with a reason; proof of delivery (photo, optional OTP or signature)
- [ ] Status changes go through server functions that check the allowed transition (no jumping NEW → DELIVERED) and write an `order_events` row
- [ ] Loading, empty and error states on every screen; error boundary at the app root; retry on network failure
- [ ] Replace the home-made router with React Router (or TanStack Router); add a SPA fallback rewrite on the host so `/track/...`, `/seller/...` deep links work
- [ ] Customer tracking: public link by random token (not a guessable `ORD-000003`), no personal data beyond first name, rider first name and masked phone

**Exit:** a seller creates an order on one phone, an admin assigns it on a laptop, a rider updates it on another phone, and the customer's tracking link updates, with no refresh.

### Phase 3 — Realtime, maps and notifications (about 1–2 weeks)
- [ ] Realtime subscriptions for order status and rider assignment
- [ ] Rider location: opt-in, foreground sharing only at first, throttled (every 10–15 s while on delivery), stops when the order ends. Explain it clearly in-app
- [ ] Real map (MapLibre GL JS + OpenFreeMap tiles) on tracking and rider screens replacing `MapGraphic` (keep the SVG as a loading fallback)
- [ ] Address entry: map pin-drop plus a typed landmark; store coordinates and the written address. Add geocoding later only if the pilot shows it is needed (public OSM geocoders restrict heavy use, so check their policy first)
- [ ] Notifications: SMS and/or WhatsApp to customers on assigned, out for delivery, delivered, failed (Termii, Twilio or WhatsApp Business API). Web push for riders and sellers once installed
- [ ] Click-to-call and WhatsApp deep links using the real rider and customer numbers
- [ ] Rate limiting on OTP requests and on the public tracking endpoint

**Exit:** a customer gets an SMS with a link and sees the rider moving on a map.

### Phase 4 — Money: COD, fees and payouts (about 2 weeks; highest risk)
- [ ] Define the pricing rules with Victor: delivery fee by zone or distance, COD handling fee, failed-delivery fee, return fee. Store them in a table, not in code
- [ ] Replace the hardcoded ₦800 rider rate, ₦3,000 bonus and `− 5000` settlement placeholder with ledger entries
- [ ] Ledger: append-only `ledger_entries` table (debit, credit, order, party, amount in kobo as integers, reason). Balances are computed from it, never edited
- [ ] COD flow: rider records cash collected, admin reconciles, seller balance updates, payout request, admin approves
- [ ] Payouts to sellers and riders through the chosen provider's transfer API, with idempotency keys so a retry cannot pay twice
- [ ] Online payment of delivery fees if in scope (Paystack/Flutterwave checkout, verified by webhook, not by the browser redirect)
- [ ] Webhook endpoint with signature verification
- [ ] Daily reconciliation report for admin: collected, owed, paid out, disputed
- [ ] Dispute and return handling flow (`AdminReturns` already has the UI shell)

**Exit:** run ten real or test-mode deliveries end to end and the ledger balances to the kobo.

### Phase 5 — Installable app (PWA) (about 3–4 days)
- [ ] `manifest.webmanifest`: name, short name, `start_url`, `display: standalone`, theme and background colours
- [ ] Icon set: 192, 512, maskable 512, Apple touch icon, from the danfo artwork (`lagos.png` can seed it)
- [ ] Service worker (Vite PWA plugin): cache the app shell; show a friendly offline screen; queue status updates for riders while offline and sync when back online
- [ ] Install prompt UX: "Add to Home Screen" banner on Android; short instructions for iOS Safari
- [ ] Separate entry points so riders can install straight to `/rider`, sellers to `/seller` (per-role `start_url` or per-role manifests)
- [ ] Update flow: tell the user when a new version is ready
- [ ] Meta tags: description, Open Graph image, theme-color that matches the real header colour (currently `#1A1A1A`)
- [ ] Lighthouse PWA and performance pass on a mid-range Android phone over throttled 3G/4G; target first load under about 3 s and a bundle that stays small (currently about 85 kB gzipped JS)

**Exit:** installing from Chrome on Android and Safari on iPhone gives a home-screen icon that opens full screen and survives a dropped connection.

### Phase 6 — Security, privacy and quality (runs alongside, gate before launch)
- [ ] Threat model one page: who can see what, what a stolen rider phone exposes, what a guessed URL exposes
- [ ] No secrets in the client bundle. Only the Supabase anon key ships to the browser; the service-role key and payment secrets live in server functions only
- [ ] Validate all input on the server too (order creation, status change, payout request). Treat the client as untrusted
- [ ] Security headers on the host: CSP, `X-Content-Type-Options`, `Referrer-Policy`, HSTS; cookies `Secure`/`HttpOnly`/`SameSite` where used
- [ ] Brute-force and OTP-abuse protection; account lockout and device/session list
- [ ] Audit log for admin actions (who changed a status, who approved a payout)
- [ ] Backups: automatic daily database backups, and one tested restore
- [ ] Dependency audit (`npm audit`) and Dependabot
- [ ] Privacy: privacy policy and terms in the app footer; consent for location sharing; data retention rule; a way for a user to request deletion (NDPA)
- [ ] Tests: unit tests for status transitions, money maths and phone validation; end-to-end tests (Playwright) for the four main journeys
- [ ] Error monitoring (Sentry or similar) and uptime check
- [ ] Accessibility pass: contrast, focus states, labels on icon buttons, text scaling to 200%
- [ ] Test on real low-end Android devices (Tecno, Infinix, Samsung A-series) and iOS Safari

**Exit:** no open high-severity items; tests pass in CI.

### Phase 7 — Deploy and pilot (about 1 week + pilot)
- [ ] Hosting: Vercel, Netlify or Cloudflare Pages for the frontend; SPA rewrite rule; production and staging environments with separate env vars
- [ ] Custom domain with HTTPS; `www` redirect
- [ ] Production Supabase project with production keys; staging stays separate
- [ ] CI/CD: merge to `main` deploys to staging, a tagged release deploys to production
- [ ] Onboarding: first-run tips for each role; a one-page "how to use" guide in English and Pidgin for riders
- [ ] Support channel (WhatsApp number or email) shown inside the app
- [ ] Analytics that respect privacy (page and funnel events only, no personal data)
- [ ] Pilot with real sellers and riders in one zone; daily check-in; log every bug and confusion
- [ ] Fix the pilot's top issues, then repeat with a larger group

**Exit:** two weeks of pilot with zero money discrepancies and no critical bugs.

### Phase 8 — Public launch and after
- [ ] Landing page that sells the product (the current `LandingPage.tsx` is a demo picker, so build a real marketing page and keep the picker as `/demo`)
- [ ] Seller sign-up page with approval queue
- [ ] Announce through the existing channels (WhatsApp, social, your clothing brands as the first sellers)
- [ ] Weekly metrics: orders, delivery success rate, average delivery time, COD reconciliation gap, rider utilisation
- [ ] Later: route batching, rider shifts, seller API/webhooks, Google Play wrapper, multi-city zones

---

## 4. Draft database model (for review in Phase 1)

All money is stored as integer **kobo**. All tables have `id uuid`, `created_at`, `updated_at`. RLS on everything.

- `profiles` (id = auth user id, role, full_name, phone, status)
- `sellers` (profile_id, business_name, area, approved_at)
- `riders` (profile_id, vehicle_type, current_zone_id, status `available | on_delivery | offline`)
- `zones` (name, geometry or area list, base_fee_kobo)
- `customers` (name, phone, address, area, lat, lng); customers may be guests created per order
- `orders` (public_ref `ORD-######`, tracking_token, seller_id, customer_id, rider_id nullable, status, product_description, cod_amount_kobo, delivery_fee_kobo, pickup address, dropoff address and coordinates, failure_reason)
- `order_events` (order_id, from_status, to_status, actor_id, note, created_at) — append only; powers the tracking timeline
- `rider_locations` (rider_id, order_id, lat, lng, recorded_at) — short retention
- `proof_of_delivery` (order_id, photo_path, otp_verified, signed_by)
- `ledger_entries` (party_type, party_id, order_id, amount_kobo, direction, reason, created_at) — append only
- `payouts` (party_id, amount_kobo, status, provider_ref, idempotency_key, approved_by)
- `returns` (order_id, reason, status, resolved_by)
- `notifications` (order_id, channel, template, status, provider_ref)
- `audit_log` (actor_id, action, entity, entity_id, before, after)

Current TypeScript types map onto this: `Order`, `Seller`, `Rider`, `Customer`, the eight `OrderStatus` values, and the status-to-badge mapping stay as they are.

---

## 5. Launch checklist (every box must be ticked)

**Product**
- [ ] A new seller can sign up, get approved, create an order and see it delivered
- [ ] A rider can be invited, install the app, receive an assignment and complete it
- [ ] A customer can track from an SMS link without an account
- [ ] Admin can see, assign, fix and reconcile everything
- [ ] All placeholder screens (Settings, etc.) are either built or removed from navigation

**Trust and safety**
- [ ] RLS tests pass; no cross-account data leaks
- [ ] No hardcoded phone numbers, names or demo order IDs in production code
- [ ] Money ledger balances; payouts are idempotent
- [ ] Privacy policy, terms, location consent live

**Operations**
- [ ] Production and staging separated; backups tested
- [ ] Error monitoring and uptime alerts reach Victor's phone
- [ ] Support contact visible; someone is on call during pilot hours
- [ ] Rollback plan: previous deploy can be restored in one click

**Install and performance**
- [ ] Installs and opens full screen on Android Chrome and iOS Safari
- [ ] Works on a low-end Android over 3G; offline screen appears instead of a blank page
- [ ] Lighthouse mobile scores: Performance ≥ 80, Accessibility ≥ 90, PWA installable

---

## 6. Risks to watch

| Risk | Why it matters | Mitigation |
|---|---|---|
| Money handling errors | Sellers and riders will notice immediately; trust is gone | Integer kobo, append-only ledger, idempotent payouts, daily reconciliation, test-mode runs first |
| Poor connectivity | Riders work on patchy networks | Offline queue for status updates, small bundle, retry with backoff |
| Rider location privacy | Tracking people is sensitive | Opt-in, only during active deliveries, short retention, clear wording |
| OTP/SMS cost and abuse | SMS costs per message, and bots can drain a balance | Rate limits, CAPTCHA on request, budget alerts |
| Address quality | Lagos addresses are hard to geocode | Landmarks field, pin-drop on map, customer confirmation by phone |
| Scope creep | Launch slips | Ship the pilot zone first; later features stay in "after launch" |

---

## 7. Change log

- 2026-10-30: Phase 0 done locally: renamed to Eko Riders, build errors cleared, dead code removed, ngrok host removed, `.env.example`, CI workflow and README added. Smoke-tested all routes at 360 px with no console errors.
- 2026-10-30: Sign-up decided: Supabase Auth. Pilot zone decided: Ikeja.
- 2026-10-30: Decisions recorded: name Eko Riders, Supabase, Paystack, MapLibre + OpenFreeMap. Legal documents still open.
- 2026-10-30: Audited the codebase and wrote this roadmap. Fixed the broken JSX fragment in `AdminRiders.tsx`; local branch `claude/admin-empty-states-build-fix` is committed but not yet pushed.
