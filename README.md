# Web3 Transaction Platform

## Full Product and Engineering Architecture Specification

**Document status:** Initial architecture baseline  
**Repository:** `lackx741-tech/Implementation`  
**Version:** 1.0.0  
**Date:** 2026-09-26

---

## 1. Purpose

This document defines a complete, vendor-neutral architecture for a web3 application that provides:

- a browser-based dApp experience;
- wallet connection through provider adapters;
- session and workflow management;
- transaction request construction;
- client-side transaction authorization;
- transaction submission and status tracking;
- administrative and operational dashboards;
- reporting, configuration, and data export capabilities.

The specification is intended to serve as the engineering baseline for implementation, testing, deployment, and future service decomposition.

---

## 2. Product Scope

### 2.1 Included

- Frontend dApp interface.
- Wallet provider abstraction.
- Session lifecycle management.
- Transaction workflow orchestration.
- Signed transaction intake and submission.
- Real-time workflow events.
- Role-based administration console.
- User, campaign, configuration, and activity management.
- Operational reporting and export jobs.
- Observability, testing, and deployment standards.

### 2.2 Excluded

- Implementation details of third-party wallet applications.
- Blockchain node implementation internals.
- Exchange or custody infrastructure.
- Legal, financial, or compliance policy decisions.

---

## 3. Product Goals

1. Provide a clear and consistent web3 user experience.
2. Support multiple wallet providers through a common adapter interface.
3. Make transaction workflows configurable and observable.
4. Separate public-facing services from administrative functions.
5. Support asynchronous processing for long-running operations.
6. Provide reliable workflow status and reporting.
7. Maintain traceability across client, API, worker, and data layers.
8. Allow the platform to scale horizontally as usage grows.

---

## 4. Architectural Principles

- **Separation of concerns:** presentation, workflow, transaction, administration, and reporting are separate modules.
- **Provider abstraction:** wallet-specific behavior is isolated behind a common interface.
- **Configuration over duplication:** reusable workflow templates and runtime configuration are preferred over repeated code paths.
- **Explicit state transitions:** every workflow stage has a defined state and transition event.
- **Asynchronous processing:** queues and workers handle operations that do not need to block user requests.
- **Observable execution:** every request and workflow is traceable through correlation identifiers.
- **Versioned contracts:** APIs, event envelopes, and persisted schemas are versioned.
- **Progressive delivery:** features are released with environment separation and controlled rollout.

---

## 5. High-Level System Architecture

```text
+-----------------------------+
|        Web dApp Client      |
| UI, wallet adapters, state  |
+--------------+--------------+
               |
               v
+-----------------------------+
|       API Gateway / BFF     |
| routing, validation, limits |
+------+----------+-----------+
       |          |
       v          v
+-------------+  +------------------+
| Session API |  | Workflow API     |
| sessions    |  | orchestration    |
+------+------+  +--------+---------+
       |                  |
       v                  v
+-------------+  +------------------+
| Event Layer |  | Transaction      |
| SSE/WebSock |  | Service          |
+------+------+  +--------+---------+
       |                  |
       +--------+---------+
                v
       +------------------+
       | Queue / Workers  |
       | async processing |
       +--------+---------+
                |
                v
       +------------------+
       | Chain Interface  |
       | node/RPC clients |
       +------------------+

+-----------------------------+
|       Control Plane         |
| admin/operator application  |
+--------------+--------------+
               v
+-----------------------------+
| Admin and Reporting APIs    |
+--------------+--------------+
               v
+-----------------------------+
| Relational DB | Event Store |
| Analytics DB  | Object Store |
+-----------------------------+
```

---

## 6. Logical Layers

### 6.1 Client Layer
Responsible for the dApp interface, wallet provider interactions, client state, and workflow presentation.

### 6.2 API Layer
Provides authenticated and versioned HTTP APIs for session creation, workflow initiation, transaction processing, administration, and reporting.

### 6.3 Orchestration Layer
Coordinates workflow stages, applies configuration, creates transaction request bundles, and publishes lifecycle events.

### 6.4 Processing Layer
Executes asynchronous jobs such as transaction submission, status polling, report generation, and data export.

### 6.5 Control Plane
Provides administrative views, configuration management, user management, activity review, and operational reporting.

### 6.6 Data Layer
Stores operational records, append-only events, analytics projections, and generated export artifacts.

---

## 7. Frontend dApp Specification

### 7.1 Responsibilities

- Render the application shell and route-level pages.
- Initialize client configuration.
- Create or resume a user session.
- Discover supported wallet providers.
- Connect to a selected provider.
- Request transaction authorization through the provider.
- Display workflow progress and errors.
- Subscribe to real-time workflow events.
- Reconcile client state after reconnect or page refresh.

### 7.2 Frontend Modules

```text
src/
├── app/
│   ├── routes/
│   ├── providers/
│   └── application-state/
├── components/
│   ├── wallet-selector/
│   ├── connection-status/
│   ├── workflow-progress/
│   └── transaction-status/
├── wallet/
│   ├── adapter-interface
│   ├── provider-registry
│   ├── browser-provider
│   ├── mobile-provider
│   └── bridge-provider
├── api/
│   ├── session-client
│   ├── workflow-client
│   └── transaction-client
├── state/
│   ├── session-store
│   ├── wallet-store
│   └── workflow-store
└── telemetry/
    ├── event-client
    └── performance-client
```

### 7.3 Wallet Adapter Interface

```typescript
interface WalletAdapter {
  id: string;
  displayName: string;
  isAvailable(): Promise<boolean>;
  connect(): Promise<WalletConnection>;
  disconnect(): Promise<void>;
  getAddress(): Promise<string>;
  authorizeTransaction(request: TransactionRequest): Promise<SignedTransaction>;
  getNetwork(): Promise<NetworkContext>;
}
```

### 7.4 Client State Machine

```text
INIT
  -> SESSION_READY
  -> WALLET_DISCOVERY
  -> WALLET_CONNECTING
  -> WALLET_CONNECTED
  -> WORKFLOW_REQUESTED
  -> TRANSACTION_READY
  -> AUTHORIZATION_PENDING
  -> SIGNED_SUBMISSION
  -> PROCESSING
  -> COMPLETED

Any state may transition to ERROR.
ERROR may transition to RETRYING or TERMINATED.
```

### 7.5 Frontend UX Requirements

- Clearly identify the current workflow stage.
- Display the selected wallet and network context.
- Display human-readable transaction status.
- Prevent duplicate submissions while a request is in progress.
- Recover gracefully from wallet disconnection.
- Support mobile and desktop layouts.
- Preserve workflow state across temporary network interruption.

---

## 8. API Gateway and Backend-for-Frontend

### 8.1 Responsibilities

- Route requests to internal services.
- Validate request schemas.
- Apply API versioning.
- Attach request and correlation identifiers.
- Normalize errors.
- Enforce request size and rate policies.
- Provide a frontend-oriented response shape.

### 8.2 API Conventions

- Base path: `/api/v1`.
- JSON request and response bodies.
- ISO 8601 timestamps in UTC.
- UUIDs for externally visible identifiers.
- Consistent error envelope.
- Pagination using `page`, `pageSize`, and `nextCursor` where appropriate.

### 8.3 Error Envelope

```json
{
  "error": {
    "code": "WORKFLOW_NOT_FOUND",
    "message": "The requested workflow could not be found.",
    "requestId": "request-id",
    "details": []
  }
}
```

---

## 9. Session Service

### 9.1 Responsibilities

- Create user interaction sessions.
- Associate wallet context with a session.
- Maintain session lifecycle state.
- Store client capability and network metadata.
- Correlate frontend events with backend workflows.

### 9.2 Session States

- `CREATED`
- `ACTIVE`
- `PAUSED`
- `COMPLETED`
- `EXPIRED`
- `CLOSED`

### 9.3 Session API

#### Create Session

`POST /api/v1/sessions`

```json
{
  "applicationId": "web-app",
  "network": "target-network",
  "locale": "en-US",
  "client": {
    "platform": "desktop",
    "version": "1.0.0"
  }
}
```

#### Get Session

`GET /api/v1/sessions/{sessionId}`

#### Append Session Event

`POST /api/v1/sessions/{sessionId}/events`

```json
{
  "type": "wallet_connected",
  "occurredAt": "2026-09-26T18:24:08Z",
  "metadata": {}
}
```

---

## 10. Workflow Orchestration Service

### 10.1 Responsibilities

- Start and manage workflow runs.
- Load effective configuration.
- Select a workflow template.
- Build ordered transaction request bundles.
- Track workflow stage transitions.
- Publish lifecycle events.
- Coordinate with asynchronous workers.

### 10.2 Workflow Entity

```json
{
  "workflowId": "workflow-id",
  "sessionId": "session-id",
  "templateId": "template-id",
  "network": "target-network",
  "status": "TRANSACTION_READY",
  "createdAt": "2026-09-26T18:24:08Z",
  "updatedAt": "2026-09-26T18:24:12Z",
  "transactionBundleId": "bundle-id"
}
```

### 10.3 Workflow API

#### Start Workflow

`POST /api/v1/workflows`

```json
{
  "sessionId": "session-id",
  "walletAddress": "wallet-address",
  "network": "target-network",
  "templateId": "default-template"
}
```

#### Get Workflow

`GET /api/v1/workflows/{workflowId}`

#### Get Workflow Events

`GET /api/v1/workflows/{workflowId}/events`

---

## 11. Transaction Service

### 11.1 Responsibilities

- Translate workflow templates into chain-compatible transaction requests.
- Group transactions into ordered bundles.
- Track transaction status.
- Submit authorized transaction objects to configured chain interfaces.
- Poll or receive confirmation updates.
- Publish status changes.

### 11.2 Transaction Bundle

```json
{
  "bundleId": "bundle-id",
  "workflowId": "workflow-id",
  "network": "target-network",
  "sequence": 1,
  "status": "READY",
  "transactions": [
    {
      "transactionId": "transaction-id",
      "index": 0,
      "status": "AWAITING_AUTHORIZATION",
      "request": {}
    }
  ]
}
```

### 11.3 Transaction States

- `CREATED`
- `READY`
- `AWAITING_AUTHORIZATION`
- `AUTHORIZED`
- `QUEUED`
- `SUBMITTED`
- `CONFIRMED`
- `REJECTED`
- `EXPIRED`
- `FAILED`

### 11.4 Signed Transaction API

`POST /api/v1/transactions/signed`

```json
{
  "workflowId": "workflow-id",
  "bundleId": "bundle-id",
  "transactions": [
    {
      "transactionId": "transaction-id",
      "signedPayload": {}
    }
  ]
}
```

Response:

```json
{
  "accepted": true,
  "workflowId": "workflow-id",
  "statuses": [
    {
      "transactionId": "transaction-id",
      "status": "QUEUED"
    }
  ]
}
```

---

## 12. Chain Interface Layer

### 12.1 Purpose

The chain interface isolates blockchain-network-specific behavior from the rest of the platform.

### 12.2 Interface

```typescript
interface ChainAdapter {
  networkId: string;
  getCurrentBlock(): Promise<number>;
  estimateFee(request: ChainTransactionRequest): Promise<FeeEstimate>;
  submit(signedPayload: SignedPayload): Promise<SubmissionResult>;
  getStatus(reference: string): Promise<ChainTransactionStatus>;
  normalizeError(error: unknown): NormalizedChainError;
}
```

### 12.3 Adapter Responsibilities

- Network connection management.
- Request serialization.
- Fee and resource estimation.
- Submission handling.
- Confirmation tracking.
- Network-specific error normalization.

---

## 13. Event and Real-Time Layer

### 13.1 Responsibilities

- Publish workflow state transitions.
- Deliver transaction status changes to connected clients.
- Support reconnect and event replay.
- Provide a consistent event envelope across services.

### 13.2 Transport

The platform may use Server-Sent Events or WebSockets. The transport must support:

- connection identification;
- ordered sequence numbers;
- reconnect handling;
- heartbeat messages;
- event replay from a supplied cursor;
- graceful stream closure.

### 13.3 Event Envelope

```json
{
  "eventId": "event-id",
  "eventType": "transaction_status_changed",
  "sequence": 12,
  "sessionId": "session-id",
  "workflowId": "workflow-id",
  "occurredAt": "2026-09-26T18:24:12Z",
  "payload": {
    "transactionId": "transaction-id",
    "status": "CONFIRMED"
  }
}
```

### 13.4 Event Types

- `session_created`
- `wallet_discovered`
- `wallet_connected`
- `workflow_started`
- `transaction_bundle_ready`
- `authorization_requested`
- `signed_payload_received`
- `transaction_queued`
- `transaction_submitted`
- `transaction_confirmed`
- `workflow_completed`
- `workflow_failed`

---

## 14. Queue and Worker Architecture

### 14.1 Worker Responsibilities

- Transaction submission.
- Confirmation polling.
- Event projection.
- Analytics aggregation.
- Export generation.
- Notification processing.
- Data cleanup according to retention rules.

### 14.2 Queue Types

- `transaction-submission`
- `transaction-status`
- `workflow-events`
- `report-generation`
- `export-generation`
- `maintenance`

### 14.3 Job Envelope

```json
{
  "jobId": "job-id",
  "jobType": "transaction_submission",
  "attempt": 1,
  "createdAt": "2026-09-26T18:24:08Z",
  "payload": {}
}
```

### 14.4 Processing Rules

- Jobs must be idempotent.
- Failed jobs use bounded retry policies.
- Permanent failures are moved to a review queue.
- Worker metrics include duration, attempt count, and outcome.

---

## 15. Control Plane Specification

### 15.1 Purpose

The control plane is the administrative application used to manage platform configuration, operational records, workflow templates, users, and reports.

### 15.2 Functional Areas

1. Dashboard
2. User registry
3. Workflow registry
4. Transaction activity
5. Template management
6. Configuration center
7. Team and role management
8. Activity history
9. Reporting
10. Export center

### 15.3 Generic Roles

- **Administrator:** manages platform-wide configuration and team access.
- **Operator:** manages assigned workflows, campaigns, and operational records.
- **Analyst:** views reports and activity records.
- **Support:** reviews user-facing workflow status and support information.

### 15.4 Dashboard Metrics

- active sessions;
- completed workflows;
- pending workflows;
- transaction submission volume;
- confirmation rate;
- average workflow duration;
- activity by network, provider, campaign, and time period;
- export job status.

---

## 16. Configuration Service

### 16.1 Configuration Domains

- supported networks;
- wallet provider priority;
- workflow templates;
- transaction sequence definitions;
- timeout and retry values;
- UI labels and localization;
- campaign metadata;
- reporting dimensions;
- feature flags.

### 16.2 Configuration Versioning

Every configuration change creates an immutable version record:

```json
{
  "configVersionId": "config-version-id",
  "domain": "workflow",
  "version": 4,
  "effectiveAt": "2026-09-26T18:24:08Z",
  "createdBy": "operator-id",
  "values": {}
}
```

### 16.3 Effective Configuration

```text
Effective Configuration
= Platform Defaults
+ Network Overrides
+ Workflow Template Values
+ Campaign Overrides
+ Session Context
```

---

## 17. Reporting and Export Architecture

### 17.1 Reporting Sources

- session events;
- workflow state changes;
- transaction status records;
- provider connection outcomes;
- operator activity;
- configuration history.

### 17.2 Reporting Pipeline

```text
Operational Events
      |
      v
Event Projection Worker
      |
      v
Analytics Tables
      |
      +--> Dashboard Queries
      |
      +--> Scheduled Reports
      |
      +--> Export Jobs
```

### 17.3 Export Formats

- JSON
- CSV
- JSON Lines
- Parquet for analytical workloads

### 17.4 Export Job Lifecycle

- `REQUESTED`
- `QUEUED`
- `GENERATING`
- `AVAILABLE`
- `EXPIRED`
- `FAILED`

---

## 18. Data Model

### 18.1 Core Tables

```text
users
sessions
wallet_connections
workflow_runs
workflow_events
transaction_bundles
transactions
transaction_status_history
chain_submissions
operators
roles
operator_roles
workflow_templates
configuration_versions
campaigns
activity_records
export_jobs
```

### 18.2 Relationship Model

```text
User 1---N Session
Session 1---N WorkflowRun
Session 1---N WalletConnection
WorkflowRun 1---N WorkflowEvent
WorkflowRun 1---1 TransactionBundle
TransactionBundle 1---N Transaction
Transaction 1---N TransactionStatusHistory
Transaction 1---N ChainSubmission
Operator N---N Role
WorkflowTemplate 1---N WorkflowRun
ConfigurationVersion 1---N WorkflowRun
Campaign 1---N WorkflowRun
```

### 18.3 Data Classification

- Public application configuration
- Internal operational records
- Restricted account and activity records
- Sensitive authentication and integration material

---

## 19. Database Requirements

### 19.1 Relational Database

Use a relational database for:

- transactional workflow state;
- operator and role records;
- configuration versions;
- template definitions;
- status history;
- export job metadata.

### 19.2 Event Store

Use an append-only event store for:

- workflow event history;
- state transition reconstruction;
- operational timeline queries;
- downstream analytics projection.

### 19.3 Cache

Use a cache for:

- active session lookups;
- configuration snapshots;
- provider metadata;
- short-lived workflow state;
- dashboard query acceleration.

### 19.4 Object Storage

Use object storage for:

- generated exports;
- scheduled report files;
- archived evidence or operational packages;
- large data extracts.

---

## 20. API Resource Summary

```text
POST   /api/v1/sessions
GET    /api/v1/sessions/{sessionId}
POST   /api/v1/sessions/{sessionId}/events

POST   /api/v1/workflows
GET    /api/v1/workflows/{workflowId}
GET    /api/v1/workflows/{workflowId}/events

GET    /api/v1/transaction-bundles/{bundleId}
POST   /api/v1/transactions/signed
GET    /api/v1/transactions/{transactionId}

GET    /api/v1/admin/dashboard
GET    /api/v1/admin/users
GET    /api/v1/admin/workflows
GET    /api/v1/admin/transactions
GET    /api/v1/admin/configuration
PUT    /api/v1/admin/configuration
GET    /api/v1/admin/templates
POST   /api/v1/admin/templates
PATCH  /api/v1/admin/templates/{templateId}

POST   /api/v1/admin/exports
GET    /api/v1/admin/exports/{exportId}
GET    /api/v1/admin/reports
```

---

## 21. Repository Structure

```text
Implementation/
├── apps/
│   ├── web-dapp/
│   └── control-plane/
├── services/
│   ├── api-gateway/
│   ├── session-service/
│   ├── workflow-service/
│   ├── transaction-service/
│   ├── event-service/
│   ├── reporting-service/
│   └── export-service/
├── workers/
│   ├── transaction-worker/
│   ├── confirmation-worker/
│   ├── projection-worker/
│   └── export-worker/
├── packages/
│   ├── api-contracts/
│   ├── event-contracts/
│   ├── domain-models/
│   ├── wallet-adapters/
│   ├── chain-adapters/
│   ├── ui-components/
│   └── configuration/
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── fixtures/
├── infrastructure/
│   ├── containers/
│   ├── environments/
│   ├── queues/
│   └── observability/
├── docs/
│   ├── api/
│   ├── decisions/
│   ├── diagrams/
│   └── runbooks/
└── README.md
```

---

## 22. Deployment Architecture

### 22.1 Environments

- `local`
- `development`
- `staging`
- `production`

Each environment must use separate configuration, data stores, queues, and integration credentials.

### 22.2 Runtime Components

- CDN or static asset host for frontend bundles;
- load balancer;
- API gateway;
- stateless application services;
- worker deployment;
- queue service;
- relational database;
- event store;
- cache;
- object storage;
- monitoring and log aggregation.

### 22.3 Scaling Strategy

- Horizontally scale API services.
- Scale workers independently according to queue depth.
- Use read replicas for dashboard and reporting workloads.
- Partition or archive high-volume event records.
- Cache frequently accessed configuration and session data.

---

## 23. Observability Specification

### 23.1 Required Metrics

- API request count and latency;
- session creation rate;
- active sessions;
- wallet connection outcomes;
- workflow completion rate;
- transaction bundle generation duration;
- signed submission throughput;
- chain submission outcomes;
- event delivery latency;
- queue depth and job duration;
- report and export duration.

### 23.2 Correlation Fields

Every service log and event should include:

```text
requestId
traceId
sessionId
workflowId
bundleId
transactionId
operatorId
serviceName
environment
```

### 23.3 Dashboards

- Platform health
- User workflow funnel
- Transaction processing
- Queue and worker health
- Control plane activity
- Reporting and export status

---

## 24. Testing Strategy

### 24.1 Unit Testing

- wallet adapter behavior;
- API validators;
- workflow state transitions;
- configuration merging;
- transaction serialization;
- event ordering;
- export formatting.

### 24.2 Integration Testing

- API and database integration;
- queue and worker processing;
- event stream delivery;
- chain adapter mocks;
- configuration persistence;
- reporting projections.

### 24.3 End-to-End Testing

- session creation to workflow completion;
- wallet provider simulation;
- transaction authorization simulation;
- reconnect and recovery scenarios;
- dashboard configuration changes;
- report and export generation.

### 24.4 Performance Testing

- concurrent session load;
- workflow creation bursts;
- queue throughput;
- dashboard query latency;
- export generation under large datasets.

---

## 25. Reliability Requirements

- API services must be stateless and restartable.
- Workflow state must survive service restarts.
- Queue jobs must support retry and idempotent execution.
- Event streams must support reconnect and replay.
- Database migrations must be backward-compatible during deployment.
- Long-running operations must expose progress state.
- External chain provider interruptions must produce recoverable workflow states.

---

## 26. Release and Delivery Process

### 26.1 Branching

- `main`: production-ready code.
- `develop`: integration branch where used.
- short-lived feature branches for isolated changes.

### 26.2 Pipeline Stages

1. Install dependencies.
2. Static analysis.
3. Unit tests.
4. Contract tests.
5. Build frontend and services.
6. Database migration validation.
7. Integration tests.
8. Staging deployment.
9. End-to-end tests.
10. Production release approval.

### 26.3 Versioning

- semantic versioning for packages and services;
- versioned API paths;
- migration numbers for database changes;
- changelog entries for user-visible behavior.

---

## 27. Implementation Phases

### Phase 1: Foundation

- repository and package setup;
- frontend application shell;
- API gateway;
- session service;
- relational schema;
- base wallet adapter interface;
- initial control-plane shell.

### Phase 2: Workflow Core

- workflow service;
- transaction bundle model;
- event stream;
- transaction service;
- chain adapter interface;
- initial worker queues.

### Phase 3: Operations

- dashboard metrics;
- configuration center;
- workflow templates;
- user registry;
- activity history;
- export jobs.

### Phase 4: Scale and Optimization

- analytics projections;
- cache integration;
- read replicas;
- worker autoscaling;
- multi-network support;
- advanced reporting.

---

## 28. Acceptance Criteria

The implementation is considered complete when:

1. A client can create a session and connect a supported wallet provider.
2. A workflow can be started from a valid session.
3. The workflow service can create a transaction bundle from a versioned template.
4. The client can authorize transaction requests through an adapter interface.
5. Signed transaction objects can be submitted and tracked through status states.
6. Real-time events update the client without requiring a full page refresh.
7. Operators can view workflow and transaction activity in the control plane.
8. Authorized operators can update configuration and workflow templates.
9. Reports and structured exports can be generated asynchronously.
10. All major components emit traceable lifecycle events and metrics.
11. The platform can scale API and worker services independently.
12. Automated unit, integration, end-to-end, and performance tests are available.

---

## 29. Initial Engineering Backlog

### Epic A: Repository Foundation

- Create monorepo or service workspace.
- Add TypeScript configuration.
- Add linting and formatting.
- Add test runner.
- Add shared contracts package.
- Add local development orchestration.

### Epic B: Frontend

- Build application shell.
- Build wallet provider registry.
- Implement session bootstrap.
- Implement wallet connection UI.
- Implement workflow progress UI.
- Implement event stream client.

### Epic C: Backend

- Implement API gateway.
- Implement session endpoints.
- Implement workflow endpoints.
- Implement transaction endpoints.
- Implement event publishing.
- Implement persistence adapters.

### Epic D: Processing

- Add queue infrastructure.
- Add transaction worker.
- Add status worker.
- Add projection worker.
- Add export worker.

### Epic E: Control Plane

- Add operator authentication screens.
- Add dashboard layout.
- Add workflow table.
- Add transaction status table.
- Add configuration editor.
- Add template management.
- Add export center.

### Epic F: Quality

- Add contract tests.
- Add workflow state tests.
- Add provider adapter mocks.
- Add end-to-end test suite.
- Add load testing baseline.
- Add operational dashboards.

---

## 30. Architecture Decision Records

Future architecture decisions should be recorded under `docs/decisions/` using this format:

```text
# ADR-0001: Decision Title

## Status
Accepted | Proposed | Superseded

## Context
What problem requires a decision?

## Decision
What approach was selected?

## Alternatives
What alternatives were considered?

## Consequences
What are the expected benefits and trade-offs?
```

---

## 31. Glossary

- **dApp:** browser-based decentralized application interface.
- **Wallet provider:** client software that exposes account and transaction authorization capabilities.
- **Session:** bounded interaction context between a client and platform.
- **Workflow:** ordered set of platform stages associated with a user interaction.
- **Transaction bundle:** one or more ordered transaction requests belonging to a workflow.
- **Signed transaction:** a transaction request authorized by the connected wallet provider.
- **Relay:** downstream submission process that transfers an authorized transaction to a chain interface.
- **Chain adapter:** network-specific implementation used by the transaction service.
- **Control plane:** administrative interface and services used to configure and operate the platform.
- **Event projection:** transformation of append-only events into query-optimized reporting records.

---

## 32. Document Maintenance

This specification should be updated when:

- a new service is introduced;
- an API contract changes;
- a new wallet or network adapter is added;
- a data model changes;
- deployment topology changes;
- a major architecture decision is accepted.

All material changes should include a corresponding architecture decision record and changelog entry.
