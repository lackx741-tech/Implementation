export interface ApiClientOptions { baseUrl: string; fetchImpl?: typeof fetch; }
export interface BuilderBuildInput {
  name: string; version: string; domainAllowlist: string[];
  modules: Array<'wallet-modal' | 'session-client' | 'eip712-preview' | 'tx-preview'>;
  eip712: { enabled: boolean; domainName: string; domainVersion: string; chainId: number; verifyingContract: string };
}

export class PlatformApiClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;
  constructor(options: ApiClientOptions) { this.baseUrl = options.baseUrl.replace(/\/$/, ''); this.fetchImpl = options.fetchImpl ?? fetch; }
  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await this.fetchImpl(`${this.baseUrl}${path}`, init);
    if (!response.ok) throw new Error(`request failed: ${response.status}`);
    return response.json() as Promise<T>;
  }
  createSession() { return this.request<{ session: { id: string } }>('/api/v1/sessions', { method: 'POST' }); }
  createWorkflow(input: { sessionId: string; chainId: string; recipient: string }) {
    return this.request('/api/v1/workflows', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(input) });
  }
  createBuild(input: BuilderBuildInput) {
    return this.request('/api/v1/builder/builds', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(input) });
  }
  listBuilds() { return this.request('/api/v1/builder/builds'); }
  getBuild(id: string) { return this.request(`/api/v1/builder/builds/${encodeURIComponent(id)}`); }
  submitSigned(input: { workflowId: string; transactions: unknown[] }) {
    return this.request('/api/v1/transactions/signed', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(input) });
  }
}
