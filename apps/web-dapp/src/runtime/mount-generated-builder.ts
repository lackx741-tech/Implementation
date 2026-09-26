import { loadGeneratedScript } from './generated-script-loader.js';

export async function mountGeneratedBuilder(root: HTMLElement, input: { scriptUrl: string; checksum?: string }): Promise<void> {
  const runtime = await loadGeneratedScript({ scriptUrl: input.scriptUrl, expectedChecksum: input.checksum });
  runtime.on('state', (state) => {
    root.dispatchEvent(new CustomEvent('builder:state', { detail: state }));
  });
  root.dataset.builderVersion = runtime.version;
  root.textContent = `Builder runtime ${runtime.version} loaded`;
}
