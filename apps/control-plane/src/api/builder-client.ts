import { createBuild, getBuild, listBuilds } from '../../services/builder-service/src/index.js';
import type { BuilderConfig } from '../../services/builder-service/src/types.js';

export async function createBuildFromDashboard(config: BuilderConfig) {
  return createBuild(config);
}

export function getBuildDetails(id: string) {
  return getBuild(id);
}

export function getBuildHistory() {
  return listBuilds();
}
