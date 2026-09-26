# Phase 3 Safe Builder

## Added capabilities

- Builder service for generating deterministic client `script.js` and `manifest.json` artifacts.
- Build config validation including domain allowlist and EIP-712 domain constraints.
- Build artifact status tracking (`QUEUED`, `COMPILING`, `READY`, `FAILED`).
- Database migration for build configs, artifacts, and audit records.
- Control-plane builder page scaffold and default builder config.
- EIP-712 typed data validator and preview rendering module.
- Safe Telegram notification scaffold for build status events.
- Domain allowlist policy utility for runtime enforcement.

## Safe design rules

1. The generated script only exposes preview/runtime utilities and explicit user-action hooks.
2. No hidden authorization loops.
3. No private-key handling in client or services.
4. Build artifacts are versioned and checksummed.
5. Domain execution is constrained by allowlist.

## Next tasks

- Wire builder-service routes into the API gateway.
- Persist builds/configs in a database-backed repository.
- Add artifact storage adapter (object store + signed URL retrieval).
- Implement control-plane UI form + build history table.
- Add automated tests for builder compile pipeline and typed-data validation.
