#!/usr/bin/env bash
set -e

# Web3 Transaction Platform - Project Scaffolding Script
# Creates the full directory and placeholder file structure
# defined in the architecture specification (README.md, Section 21).

ROOT_DIR="$(pwd)"

echo "Scaffolding project structure in: $ROOT_DIR"

# ---------------------------------------------------------------------------
# apps/
# ---------------------------------------------------------------------------
mkdir -p apps/web-dapp/src/{app/{routes,providers,application-state},components/{wallet-selector,connection-status,workflow-progress,transaction-status},wallet/{adapter-interface,provider-registry,browser-provider,mobile-provider,bridge-provider},api,state,telemetry}
cd apps/web-dapp
touch README.md package.json tsconfig.json
touch src/app/routes/.gitkeep
touch src/app/providers/.gitkeep
touch src/app/application-state/.gitkeep
touch src/components/wallet-selector/.gitkeep
touch src/components/connection-status/.gitkeep
touch src/components/workflow-progress/.gitkeep
touch src/components/transaction-status/.gitkeep
touch src/wallet/adapter-interface/index.ts
touch src/wallet/provider-registry/index.ts
touch src/wallet/browser-provider/index.ts
touch src/wallet/mobile-provider/index.ts
touch src/wallet/bridge-provider/index.ts
touch src/api/session-client.ts src/api/workflow-client.ts src/api/transaction-client.ts
touch src/state/session-store.ts src/state/wallet-store.ts src/state/workflow-store.ts
touch src/telemetry/event-client.ts src/telemetry/performance-client.ts
cd "$ROOT_DIR"

mkdir -p apps/control-plane/src/{pages,components,api,state}
cd apps/control-plane
touch README.md package.json tsconfig.json
touch src/pages/.gitkeep src/components/.gitkeep src/api/.gitkeep src/state/.gitkeep
cd "$ROOT_DIR"

# ---------------------------------------------------------------------------
# services/
# ---------------------------------------------------------------------------
for svc in api-gateway session-service workflow-service transaction-service event-service reporting-service export-service; do
  mkdir -p "services/$svc/src"
  touch "services/$svc/README.md" "services/$svc/package.json" "services/$svc/tsconfig.json"
  touch "services/$svc/src/index.ts"
done

# ---------------------------------------------------------------------------
# workers/
# ---------------------------------------------------------------------------
for wrk in transaction-worker confirmation-worker projection-worker export-worker; do
  mkdir -p "workers/$wrk/src"
  touch "workers/$wrk/README.md" "workers/$wrk/package.json" "workers/$wrk/tsconfig.json"
  touch "workers/$wrk/src/index.ts"
done

# ---------------------------------------------------------------------------
# packages/
# ---------------------------------------------------------------------------
for pkg in api-contracts event-contracts domain-models wallet-adapters chain-adapters ui-components configuration; do
  mkdir -p "packages/$pkg/src"
  touch "packages/$pkg/README.md" "packages/$pkg/package.json" "packages/$pkg/tsconfig.json"
  touch "packages/$pkg/src/index.ts"
done

# ---------------------------------------------------------------------------
# database/
# ---------------------------------------------------------------------------
mkdir -p database/migrations database/seeds database/fixtures
touch database/migrations/.gitkeep
touch database/seeds/.gitkeep
touch database/fixtures/.gitkeep
touch database/README.md

# ---------------------------------------------------------------------------
# infrastructure/
# ---------------------------------------------------------------------------
mkdir -p infrastructure/containers infrastructure/environments/{local,development,staging,production} infrastructure/queues infrastructure/observability
touch infrastructure/containers/.gitkeep
touch infrastructure/environments/local/.env.example
touch infrastructure/environments/development/.env.example
touch infrastructure/environments/staging/.env.example
touch infrastructure/environments/production/.env.example
touch infrastructure/queues/.gitkeep
touch infrastructure/observability/.gitkeep
touch infrastructure/README.md

# ---------------------------------------------------------------------------
# docs/
# ---------------------------------------------------------------------------
mkdir -p docs/api docs/decisions docs/diagrams docs/runbooks
touch docs/api/.gitkeep
touch docs/decisions/.gitkeep
touch docs/diagrams/.gitkeep
touch docs/runbooks/.gitkeep
touch docs/README.md

# ---------------------------------------------------------------------------
# root-level files
# ---------------------------------------------------------------------------
touch .gitignore
touch .editorconfig
touch package.json

echo "Scaffolding complete."
