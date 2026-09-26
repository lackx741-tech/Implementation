# Release Runbook

## Release prerequisites
- Working tree is clean or changes are intentionally included.
- Configuration version is recorded.
- Build artifact is `READY`.
- Manifest checksum is recorded.
- TypeScript, unit, integration, browser, and Solidity tests pass where applicable.
- Database migrations are reviewed.
- Rollback artifact is identified.

## Release steps
1. Build all packages and applications.
2. Run the test suite.
3. Apply migrations in staging.
4. Generate the client artifact in staging.
5. Verify manifest and checksum.
6. Test the approved domain.
7. Confirm the preview and explicit confirmation behavior.
8. Publish the artifact.
9. Monitor API, event, worker, and browser metrics.

## Rollback
- Select the previous known-good version.
- Verify its checksum.
- Move the active pointer back.
- Confirm the client loads the previous manifest.
- Record the rollback reason and operator.

## Post-release
- Save release notes.
- Record build ID, config version, checksum, and deployment time.
- Review error rates and event delivery.
- Confirm the next rollback path remains available.
