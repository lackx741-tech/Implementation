import type { BuilderConfig } from '../../../../services/builder-service/src/types.js';

export const defaultBuilderConfig: BuilderConfig = {
  name: 'default-safe-runtime',
  version: '1.0.0',
  domainAllowlist: ['localhost'],
  modules: ['wallet-modal', 'session-client', 'eip712-preview', 'tx-preview'],
  eip712: {
    enabled: true,
    domainName: 'SafeRuntime',
    domainVersion: '1',
    chainId: 1337,
    verifyingContract: '0x0000000000000000000000000000000000000000',
  },
};
