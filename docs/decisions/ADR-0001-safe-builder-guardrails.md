# ADR-0001: Safe Builder Guardrails

## Status
Accepted

## Date
2026-09-26

## Context
The platform generates browser client artifacts from dashboard configuration and supports transparent web3 transaction previews. The generated client must be predictable, reviewable, and restricted to approved domains.

## Decision
The builder will:

1. Generate deterministic `script.js` and `manifest.json` artifacts.
2. Include a SHA-256 checksum in every manifest.
3. Enforce an exact domain allowlist at runtime.
4. Validate EIP-712 domain and typed-data structure before any signing request.
5. Require a visible preview and explicit user action before authorization.
6. Keep inline code limited to module bootstrapping.
7. Exclude private-key handling, custody, hidden calls, and unattended authorization.
8. Version and audit every configuration, build, publish, and rollback action.

## Alternatives considered
- Unversioned runtime configuration: rejected because rollback and reproducibility would be weak.
- Broad wildcard domain execution: rejected because it expands deployment scope unnecessarily.
- Hidden client-side defaults: rejected because users and operators need an inspectable request.
- Application-managed signing keys: rejected because the platform is non-custodial.

## Consequences
### Benefits
- Reproducible build output.
- Clear operator review process.
- Better client transparency.
- Easier incident investigation and rollback.

### Trade-offs
- Additional manifest and validation work.
- More explicit configuration management.
- Some integrations require adapter-specific preview support before release.

## Verification
The decision is enforced through builder validation, domain policy tests, EIP-712 preview tests, artifact checksum tests, and release-runbook gates.
