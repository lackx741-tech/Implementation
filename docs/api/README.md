# API and event contract notes

All public workflow requests must produce a human-readable preview before any wallet authorization is requested. The client must not hide, rewrite, or silently replace a transaction request. Every signed payload must be associated with a visible workflow and transaction identifier.

Recommended API resources:

- `POST /api/v1/sessions`
- `GET /api/v1/sessions/:id`
- `POST /api/v1/workflows`
- `GET /api/v1/workflows/:id`
- `POST /api/v1/transactions/signed`
- `GET /api/v1/workflows/:id/events`
