import type { Workflow } from '@web3-platform/domain-models';

export type PlatformEvent =
  | { type: 'session_created'; sessionId: string }
  | { type: 'wallet_connected'; sessionId: string; address: string }
  | { type: 'workflow_preview_ready'; workflowId: string }
  | { type: 'authorization_requested'; workflowId: string; transactionId: string }
  | { type: 'workflow_completed'; workflowId: string }
  | { type: 'workflow_failed'; workflowId: string; reason: string };

export interface EventEnvelope<T extends PlatformEvent = PlatformEvent> {
  eventId: string;
  sequence: number;
  occurredAt: string;
  payload: T;
}

export interface WorkflowResponse { workflow: Workflow; }
