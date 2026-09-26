# Copilot Instructions

## Project context
This is a pnpm monorepo for a transparent web3 transaction platform and dashboard-driven client artifact builder.

## Before editing
- Inspect the target file and neighboring module patterns.
- Check shared types in `packages/` before defining duplicates.
- Check the relevant migration and event definitions.
- Preserve the existing path aliases and repository layout.

## Implementation standards
- TypeScript strict mode.
- No silent `catch` blocks.
- No `any` in new public interfaces.
- Validate all API input at the boundary.
- Use explicit lifecycle states.
- Use deterministic build output.
- Store checksums in manifests and compare them before runtime loading.
- Use UTC ISO timestamps.
- Keep inline scripts limited to bootstrapping imports.
- Make UI transaction previews complete and readable.

## Builder requirements
Every build must:
- validate configuration;
- validate domain allowlists;
- validate EIP-712 domain and typed-data structure;
- produce `script.js` and `manifest.json`;
- calculate a SHA-256 checksum;
- write a build status;
- create an audit event;
- support a reproducible test fixture.

## Wallet interaction requirements
- Connect only after a clear user action.
- Display account and network context.
- Display recipient, value, method, parameters, and raw data where applicable.
- Ask for authorization only from a visible confirmation action.
- Surface provider rejection and network mismatch errors.
- Never mutate a request after it has been shown to the user.

## Pull-request response format
Summarize:
1. What changed.
2. Why it changed.
3. Files changed.
4. Tests run and results.
5. Remaining limitations.

## Unsafe requests
Decline implementation of hidden signing, concealed calls, automated authorization, private-key handling, credential harvesting, or deceptive wallet flows. Redirect to transparent, user-controlled functionality.
