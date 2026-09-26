import { createBuildFromDashboard, getBuildHistory } from '../api/builder-client.js';
import { defaultBuilderConfig } from '../state/defaultBuilderConfig.js';

export async function runBuilderDemo(): Promise<void> {
  const artifact = await createBuildFromDashboard(defaultBuilderConfig);
  console.log('[builder-demo] build result', artifact);
  console.log('[builder-demo] history', getBuildHistory());
}
