import type { TransactionRequest, WalletConnection, SignedTransaction } from '@web3-platform/domain-models';

export interface WalletAdapter {
  readonly id: string;
  readonly displayName: string;
  isAvailable(): Promise<boolean>;
  connect(): Promise<WalletConnection>;
  disconnect(): Promise<void>;
  getAddress(): Promise<string>;
  getNetwork(): Promise<string>;
  authorizeTransaction(request: TransactionRequest): Promise<SignedTransaction>;
}

export class ReadOnlyPreviewAdapter implements WalletAdapter {
  readonly id = 'preview';
  readonly displayName = 'Preview mode';

  async isAvailable() { return true; }
  async connect(): Promise<WalletConnection> {
    return { address: '', network: 'unknown', providerId: this.id };
  }
  async disconnect() {}
  async getAddress() { return ''; }
  async getNetwork() { return 'unknown'; }
  async authorizeTransaction(): Promise<SignedTransaction> {
    throw new Error('Preview mode cannot authorize transactions');
  }
}
