export interface BuilderRuntime {
  version: string;
  config: unknown;
  getConfig(): unknown;
  showTransactionPreview(preview: unknown): unknown;
  showModal(options?: Record<string, unknown>): { close(): void };
  on(event: 'state', listener: (state: unknown) => void): () => void;
}

declare global { interface Window { DashboardBuilderRuntime?: BuilderRuntime; } }

export async function loadGeneratedScript(input: { scriptUrl: string; expectedChecksum?: string }): Promise<BuilderRuntime> {
  const response = await fetch(input.scriptUrl, { cache: 'no-store' });
  if (!response.ok) throw new Error(`generated script load failed: ${response.status}`);
  const source = await response.text();
  if (input.expectedChecksum) {
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(source));
    const checksum = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
    if (checksum !== input.expectedChecksum) throw new Error('generated script checksum mismatch');
  }
  const script = document.createElement('script');
  script.textContent = source;
  document.head.append(script);
  const runtime = window.DashboardBuilderRuntime;
  if (!runtime) throw new Error('generated builder runtime did not initialize');
  return runtime;
}
