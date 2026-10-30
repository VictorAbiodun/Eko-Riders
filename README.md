# Eko Riders

Last-mile delivery for Nigerian businesses. One order ID connects four screens:

| Surface | Route |
|---|---|
| Seller dashboard | `/seller` |
| Rider app | `/rider` |
| Admin / ops | `/admin` |
| Customer tracking | `/track/ORD-000003` |

The app currently runs on mock data kept in the browser. See `progress.md` for the roadmap to launch and `agent.md` for working rules.

## Run it

```bash
npm ci
npm run dev        # http://localhost:5173
```

Other commands: `npm run build`, `npm run typecheck`, `npm run lint`, `npm run preview`.

Copy `.env.example` to `.env.local` when backend keys are needed. Never commit real keys.

Development only: `/dev/design-system` shows the design tokens.

## Stack

React 19, TypeScript, Vite, Tailwind CSS 4. Planned: Supabase (database and auth), Paystack (payments), MapLibre with OpenFreeMap (maps).
