import type { TransactionRequest, TransactionPreview, Workflow } from '@web3-platform/domain-models';

export interface WorkflowTemplate {
  id: string;
  name: string;
  version: string;
  build(context: { chainId: string; recipient: string }): TransactionRequest[];
}

export function buildPreview(template: WorkflowTemplate, context: { chainId: string; recipient: string }): TransactionPreview[] {
  return template.build(context).map((request) => ({
    request,
    humanReadableSummary: `${request.description}: ${request.to}`,
    requiresExplicitConfirmation: true,
  }));
}

export function createWorkflow(id: string, sessionId: string, previews: TransactionPreview[]): Workflow {
  return { id, sessionId, status: 'PREVIEW_READY', previews };
}
