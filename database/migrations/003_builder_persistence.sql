CREATE TABLE IF NOT EXISTS builder_publications (
  id TEXT PRIMARY KEY,
  build_id TEXT NOT NULL REFERENCES build_artifacts(id),
  environment TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  rolled_back_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS builder_one_active_publication
  ON builder_publications(environment) WHERE is_active = TRUE;

CREATE INDEX IF NOT EXISTS build_artifacts_status_created
  ON build_artifacts(status, created_at DESC);
