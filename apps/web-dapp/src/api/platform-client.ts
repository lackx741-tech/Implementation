export interface ApiClientOptions { baseUrl: string; fetchImpl?: typeof fetch; }

export class PlatformApiClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;

  constructor(options: ApiClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async createSession(): Promise<{ session: { id: string } }> {
    const response = await this.fetchImpl(`${this.baseUrl}/api/v1/sessions`, { method: 'POST' });
    if (!response.ok) throw new Error(`session creation failed: ${response.status}`);
    return response.json() as Promise<{ session: { id: string } }>;
  }

  async createWorkflow(input: { sessionId: string; chainId: string; recipient: string }) {
    const response = await this.fetchImpl(`${this.baseUrl}/api/v1/workflows`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error(`workflow creation failed: ${response.status}`);
    return response.json();
  }

  async submitSigned(input: { workflowId: string; transactions: unknown[] }) {
    const response = await this.fetchImpl(`${this.baseUrl}/api/v1/transactions/signed`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error(`submission failed: ${response.status}`);
    return response.json();
  }
}
