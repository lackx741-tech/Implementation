# Phase 4 persistence and publishing

## Added

- File-backed builder state repository for local persistence across API restarts.
- Atomic state writes using a temporary file and rename.
- Configurable artifact root through `BUILDER_STATE_ROOT`.
- Active build lookup endpoint: `GET /api/v1/builder/active`.
- Publishing endpoint: `POST /api/v1/builder/builds/:id/publish`.
- Published/rolled-back build lifecycle states.
- Dashboard API methods for active build and publishing.
- SQL migration for environment-scoped publication pointers.

## Local configuration

```bash
export BUILDER_STATE_ROOT=./artifacts
```

State is stored at:

```text
artifacts/builder-state.json
artifacts/builds/{buildId}/script.js
artifacts/builds/{buildId}/manifest.json
```

The file-backed repository is intended as the local and test adapter. Production can replace it behind the same service functions with PostgreSQL and object storage without changing the API contract.

## Publish flow

1. Create a build.
2. Inspect the generated manifest and checksum.
3. Call `POST /api/v1/builder/builds/{id}/publish`.
4. Retrieve the active artifact with `GET /api/v1/builder/active`.
5. Serve the returned `scriptPath` and manifest through the configured artifact delivery layer.
