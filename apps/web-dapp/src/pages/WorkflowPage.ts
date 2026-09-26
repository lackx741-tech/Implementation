import { PlatformApiClient } from './api/platform-client';
import { DappRuntime } from './runtime/DappRuntime';

export async function startDemo(root: HTMLElement, apiBaseUrl: string, recipient: string): Promise<DappRuntime> {
  const runtime = new DappRuntime();
  runtime.mount(root);
  const api = new PlatformApiClient({ baseUrl: apiBaseUrl });
  const { session } = await api.createSession();
  const { workflow } = await api.createWorkflow({ sessionId: session.id, chainId: 'local-development', recipient });
  runtime.showWorkflowPreview(workflow);
  return runtime;
}
