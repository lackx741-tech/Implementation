import { PlatformApiClient, type BuilderBuildInput } from '../api/platform-client.js';

export interface BuilderDashboardOptions { root: HTMLElement; api: PlatformApiClient; }

export function mountBuilderDashboard(options: BuilderDashboardOptions): void {
  const { root, api } = options;
  const form = document.createElement('form');
  form.innerHTML = `
    <label>Name <input name="name" value="client-runtime" required></label>
    <label>Version <input name="version" value="1.0.0" required></label>
    <label>Domains <input name="domains" value="localhost" required></label>
    <label>Chain ID <input name="chainId" type="number" value="1337" required></label>
    <label>Verifying contract <input name="verifyingContract" value="0x0000000000000000000000000000000000000000" required></label>
    <button type="submit">Compile script.js</button>
    <output name="status" aria-live="polite"></output>`;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const config: BuilderBuildInput = {
      name: String(data.get('name')), version: String(data.get('version')),
      domainAllowlist: String(data.get('domains')).split(',').map((value) => value.trim()).filter(Boolean),
      modules: ['wallet-modal', 'session-client', 'eip712-preview', 'tx-preview'],
      eip712: { enabled: true, domainName: 'DashboardBuilder', domainVersion: '1', chainId: Number(data.get('chainId')), verifyingContract: String(data.get('verifyingContract')) },
    };
    const output = form.elements.namedItem('status') as HTMLOutputElement;
    output.value = 'Compiling…';
    try { const result = await api.createBuild(config); output.value = `Build ${result.artifact.status}: ${result.artifact.id}`; }
    catch (error) { output.value = error instanceof Error ? error.message : 'Build failed'; }
  });
  root.replaceChildren(form);
}
