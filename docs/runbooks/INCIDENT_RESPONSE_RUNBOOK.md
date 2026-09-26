# Incident Response Runbook

## Scope
Use this runbook for unexpected build output, domain policy failures, unauthorized configuration changes, malformed typed-data previews, or abnormal workflow behavior.

## Immediate actions
1. Freeze publication of new artifacts.
2. Identify the affected build IDs, config versions, domains, and timestamps.
3. Preserve manifests, checksums, logs, and audit records.
4. Set the active artifact to the last known-good version if appropriate.
5. Disable the affected feature flag or module.
6. Notify the technical owner through the approved operations channel.

## Evidence to collect
- build ID and config version;
- artifact checksum;
- manifest content;
- audit records;
- API request IDs;
- workflow IDs;
- event sequence range;
- deployment and rollback timestamps;
- affected environment and hostname.

## Classification
- **P1:** incorrect or undisclosed transaction preview, unauthorized publication, or active production impact.
- **P2:** build generation failure, checksum mismatch, or domain policy regression with contained impact.
- **P3:** development-only failure or documentation defect.

## Recovery
- Revoke the affected publication pointer.
- Restore the last known-good artifact.
- Rebuild from the immutable configuration snapshot.
- Run unit, integration, browser, and smoke tests.
- Require independent review before republishing.

## Closure criteria
- Root cause documented.
- Affected artifacts identified.
- Recovery verified.
- Audit record complete.
- Tests added for the failure mode.
- ADR or guide updated when architecture changed.
