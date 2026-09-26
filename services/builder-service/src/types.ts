export type BuildStatus = 'QUEUED' | 'COMPILING' | 'READY' | 'FAILED' | 'PUBLISHED' | 'ROLLED_BACK';

export interface BuilderConfig {
  name: string;
  version: string;
  domainAllowlist: string[];
  modules: Array<'wallet-modal' | 'session-client' | 'eip712-preview' | 'tx-preview'>;
  eip712: {
    enabled: boolean;
    domainName: string;
    domainVersion: string;
    chainId: number;
    verifyingContract: string;
  };
}

export interface BuildArtifact {
  id: string;
  status: BuildStatus;
  config: BuilderConfig;
  scriptPath?: string;
  manifestPath?: string;
  checksum?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  error?: string;
}
