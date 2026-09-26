# Builder Runbook

## Purpose
Operate the dashboard builder that compiles a validated configuration into a versioned client `script.js` and `manifest.json`.

## Build lifecycle
```text
DRAFT -> VALIDATING -> QUEUED -> COMPILING -> READY
                                  \-> FAILED
READY -> PUBLISHED -> ROLLED_BACK
```

## Create a configuration
A configuration contains:
- name and semantic version;
- enabled modules;
- domain allowlist;
- EIP-712 domain settings;
- environment and network identifiers;
- UI labels and preview requirements.

Do not put credentials or signing material in a configuration.

## Validation checklist
- [ ] Name and version are present.
- [ ] At least one exact domain is allowlisted.
- [ ] EIP-712 name/version are present.
- [ ] Chain ID is a positive integer.
- [ ] Verifying contract is a valid address.
- [ ] Enabled modules are from the approved registry.
- [ ] Configuration is stored as an immutable version.

## Build procedure
1. Open the control-plane builder.
2. Create or select a configuration version.
3. Review the domain and network values.
4. Start a build.
5. Wait for `READY` or inspect the failure reason.
6. Verify `manifest.json` and SHA-256 checksum.
7. Compare the generated preview with the selected configuration.
8. Publish only after review.
9. Record the build ID and checksum in the release record.

## Artifact layout
```text
artifacts/builds/{buildId}/script.js
artifacts/builds/{buildId}/manifest.json
```

## Publish procedure
1. Select a `READY` artifact.
2. Confirm the version and checksum.
3. Confirm the allowlisted domains.
4. Publish the artifact.
5. Verify the active-version pointer.
6. Load the client on an approved test domain.
7. Confirm the preview renders before any wallet authorization.

## Rollback procedure
1. Identify the last known-good artifact.
2. Confirm its checksum and manifest.
3. Set it as the active version.
4. Mark the current version as rolled back.
5. Record the reason and operator in the audit log.
6. Re-run the smoke test.

## Troubleshooting
### Build fails validation
Review the displayed field-level errors. Do not bypass validation; correct the configuration and create a new version.

### Domain policy blocks runtime
Confirm the exact hostname, environment, and active manifest. Do not broaden the allowlist as a shortcut.

### Checksum mismatch
Stop publication, quarantine the artifact, and rebuild from the immutable configuration snapshot.

### EIP-712 preview is incomplete
Do not enable signing. Add decoding and preview coverage for domain, primary type, fields, and message values.

## Smoke test
```bash
curl http://localhost:3000/health
pnpm typecheck
pnpm build
pnpm test
```
