import { randomUUID } from 'node:crypto';
import { buildPreview, createWorkflow, type WorkflowTemplate } from '@web3-platform/api-contracts';

export function createPreviewWorkflow(input: {
  sessionId: string;
  chainId: string;
  recipient: string;
  template: WorkflowTemplate;
}) {
  const previews = buildPreview(input.template, { chainId: input.chainId, recipient: input.recipient });
  return createWorkflow(randomUUID(), input.sessionId, previews);
}
