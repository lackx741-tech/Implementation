export interface BuildConfigRecord {
  id: string;
  name: string;
  version: string;
  isActive: boolean;
  domainAllowlist: string[];
  modules: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BuildArtifactRecord {
  id: string;
  configId: string;
  status: 'QUEUED' | 'COMPILING' | 'READY' | 'FAILED';
  scriptPath: string | null;
  manifestPath: string | null;
  checksum: string | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditRecord {
  id: string;
  actor: string;
  action: string;
  resourceType: string;
  resourceId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}
