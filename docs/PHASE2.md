# Phase 2 implementation

## Added

- pnpm workspace and root TypeScript configuration.
- API gateway with health, session, workflow-preview, and signed-submission routes.
- Frontend API client, workflow page, and HTML bootstrap entry point.
- Development-only Foundry configuration, deployment helper, and contract test scaffold.
- Shared build scripts and package metadata.

## Run the API locally

```bash
pnpm install
pnpm --filter @platform/api-gateway build
node services/api-gateway/dist/index.js
```

The baseline API intentionally returns reviewable workflow previews and queues signed submissions without connecting to a live chain adapter.

## Contract development

Use a local or test network only during development:

```bash
cd contracts
forge build
forge test
```

The deployment helper requires `RPC_URL` and `DEPLOYER_PRIVATE_KEY` to be supplied through the local shell environment; credentials must never be committed.
