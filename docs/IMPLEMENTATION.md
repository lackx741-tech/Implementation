# Implementation Notes

## Required review gates

Before enabling a real network adapter:

1. Add unit and integration tests for request construction.
2. Add a deterministic transaction preview fixture.
3. Add explicit user confirmation handling.
4. Add network-specific validation.
5. Add independent review of any contract or transaction code.
6. Keep development adapters pointed at a local test network.

## Frontend rule

Inline scripts should be limited to bootstrapping. Application behavior belongs in versioned modules under `apps/web-dapp/src/`.

## Builder rule

Builders produce unsigned, reviewable requests. They must not contain private keys, hidden authorization, automatic signing, or silent recipient substitution.
