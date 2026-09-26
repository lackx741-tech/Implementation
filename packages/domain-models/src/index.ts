export type NetworkId = string;

export interface WalletConnection {
  address: string;
  network: NetworkId;
  providerId: string;
}

export interface TransactionRequest {
  chainId: string;
  to: string;
  value: string;
  data: string;
  gas?: string;
  nonce?: string;
  description: string;
}

export interface TransactionPreview {
  request: TransactionRequest;
  humanReadableSummary: string;
  requiresExplicitConfirmation: true;
}

export interface SignedTransaction {
  transactionId: string;
  signedPayload: unknown;
}

export interface Session {
  id: string;
  status: 'CREATED' | 'ACTIVE' | 'COMPLETED' | 'EXPIRED' | 'CLOSED';
  createdAt: string;
}

export interface Workflow {
  id: string;
  sessionId: string;
  status: 'CREATED' | 'PREVIEW_READY' | 'AWAITING_CONFIRMATION' | 'SUBMITTED' | 'COMPLETED' | 'FAILED';
  previews: TransactionPreview[];
}
