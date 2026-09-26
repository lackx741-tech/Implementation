# AGENTS.md

## Mission
Build a transparent, user-consented web3 platform with a dashboard builder that produces deterministic, reviewable client artifacts.

## Repository map
- `apps/web-dapp/`: browser UI, wallet adapter presentation, workflow preview.
- `apps/control-plane/`: builder and operations dashboard.
- `services/`: API and domain services.
- `workers/`: asynchronous processing.
- `packages/`: shared models, schemas, adapters, and contracts.
- `contracts/`: non-custodial Solidity contracts.
- `database/`: migrations and fixtures.
- `docs/`: architecture, ADRs, and runbooks.

## Non-negotiable rules
1. Every transaction request must be human-readable before authorization.
2. Authorization begins only after an explicit user action.
3. Never handle private keys, seed phrases, or custody material.
4. Never alter recipient, value, network, or calldata after preview.
5. Inline JavaScript is bootstrap-only; application logic belongs in versioned modules.
6. Generated artifacts must include a manifest, version, checksum, and domain allowlist.
7. Domain allowlist failures are closed: runtime features must not execute.
8. EIP-712 data must be validated and displayed before a signing request.
9. Configuration, build, publish, and rollback actions require audit records.
10. Do not add hidden redirects, silent retries, automatic authorization, or undisclosed calls.

## Agent workflow
1. Read `README.md`, `Projectguides.txt`, and the relevant phase document.
2. Search existing modules before creating new abstractions.
3. Keep public interfaces typed and versioned.
4. Add tests and documentation with implementation changes.
5. Run type-check, unit tests, build, and contract tests where applicable.
6. Report changed files, test results, and known limitations.

## Required checks
```bash
pnpm typecheck
pnpm build
pnpm test
cd contracts && forge build && forge test
```

## Refusal boundary
Do not implement deceptive wallet interfaces, concealed transaction construction, hidden authorization, custody, or automated asset movement. Offer a transparent preview-and-confirm alternative.
