import { validateTypedData } from '@web3-platform/builder-schema/eip712';
import type { Eip712TypedDataSpec } from '@web3-platform/builder-schema/eip712';

export function renderTypedDataPreview(container: HTMLElement, typedData: Eip712TypedDataSpec): void {
  const errors = validateTypedData(typedData);
  container.replaceChildren();

  const heading = document.createElement('h3');
  heading.textContent = 'EIP-712 typed data preview';
  container.append(heading);

  if (errors.length) {
    const ul = document.createElement('ul');
    for (const e of errors) {
      const li = document.createElement('li');
      li.textContent = e;
      ul.append(li);
    }
    container.append(ul);
    return;
  }

  const pre = document.createElement('pre');
  pre.textContent = JSON.stringify(typedData, null, 2);
  container.append(pre);
}
