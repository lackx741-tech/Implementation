import type { TransactionPreview } from '@web3-platform/domain-models';

export class TransactionPreviewModal {
  private container: HTMLElement | null = null;

  mount(container: HTMLElement): void {
    this.container = container;
  }

  render(previews: TransactionPreview[]): void {
    if (!this.container) throw new Error('modal is not mounted');
    this.container.replaceChildren();

    const title = document.createElement('h2');
    title.textContent = 'Review transaction request';
    this.container.append(title);

    const list = document.createElement('ul');
    for (const preview of previews) {
      const item = document.createElement('li');
      item.textContent = preview.humanReadableSummary;
      list.append(item);
    }
    this.container.append(list);

    const notice = document.createElement('p');
    notice.textContent = 'No wallet authorization occurs until the user explicitly confirms.';
    this.container.append(notice);
  }

  unmount(): void {
    this.container?.replaceChildren();
    this.container = null;
  }
}
