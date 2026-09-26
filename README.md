# Full Baseline Code Skeleton

This repository contains a vendor-neutral, safety-first baseline for a web3 application platform.

## Included

- Non-custodial workflow registry contract with no asset-transfer functions.
- Frontend wallet modal and provider adapter interfaces.
- Transaction preview/builder that produces reviewable, unsigned requests.
- Session/workflow API skeleton.
- Shared TypeScript domain models.
- Worker and database placeholders.
- Local configuration and implementation notes.

## Deliberate boundaries

The baseline does not include private-key handling, hidden signing, automatic authorization, custody, or unattended asset movement. Any future transaction authorization must be explicit, user-visible, and independently reviewed.

## Quick start

```bash
chmod +x scaffold.sh
./scaffold.sh
npm install
npm run build
```

## Layout

- `contracts/` — reviewable, non-custodial Solidity contract.
- `apps/web-dapp/` — frontend modal and provider abstractions.
- `services/` — API service skeletons.
- `workers/` — asynchronous processing placeholders.
- `packages/` — shared contracts, models, and adapters.
- `database/` — schema starter.
- `docs/` — API, event, and implementation notes.
