# Production script.js refinement

This phase wires the dashboard builder into the API and adds a browser loader for generated artifacts.

## Added

- `POST /api/v1/builder/builds`
- `GET /api/v1/builder/builds`
- `GET /api/v1/builder/builds/:id`
- deterministic `script.js` and `manifest.json` output under `artifacts/builds/{id}`
- SHA-256 verification in the browser loader
- dashboard builder form for compiling a client artifact
- runtime mount helper for generated client scripts
- builder schema path aliases

## Local flow

```bash
pnpm install
pnpm --filter @platform/api-gateway build
node services/api-gateway/dist/index.js
```

Create a build from the dashboard client or with:

```bash
curl -X POST http://localhost:3000/api/v1/builder/builds \
  -H 'content-type: application/json' \
  -d '{
    "name":"client-runtime",
    "version":"1.0.0",
    "domainAllowlist":["localhost"],
    "modules":["wallet-modal","session-client","eip712-preview","tx-preview"],
    "eip712":{
      "enabled":true,
      "domainName":"DashboardBuilder",
      "domainVersion":"1",
      "chainId":1337,
      "verifyingContract":"0x0000000000000000000000000000000000000000"
    }
  }'
```

The service currently stores build metadata in memory and artifacts on the local filesystem. The next production step is replacing those adapters with the database and object storage implementations described in the runbooks.
