import type { Workflow } from '@web3-platform/domain-models';
import { TransactionPreviewModal } from '../components/transaction-status/TransactionPreviewModal';

export class DappRuntime {
  private workflow: Workflow | null = null;
  private readonly modal = new TransactionPreviewModal();

  mount(modalRoot: HTMLElement): void {
    this.modal.mount(modalRoot);
  }

  showWorkflowPreview(workflow: Workflow): void {
    this.workflow = workflow;
    this.modal.render(workflow.previews);
  }

  getWorkflow(): Workflow | null { return this.workflow; }

  dispose(): void {
    this.modal.unmount();
    this.workflow = null;
  }
}
