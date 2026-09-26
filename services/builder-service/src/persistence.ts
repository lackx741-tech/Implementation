import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import type { BuildArtifact } from './types.js';

export interface BuilderState {
  builds: BuildArtifact[];
  activeBuildId: string | null;
}

const stateRoot = resolve(process.env.BUILDER_STATE_ROOT ?? 'artifacts');
const statePath = join(stateRoot, 'builder-state.json');

const emptyState = (): BuilderState => ({ builds: [], activeBuildId: null });

export async function readBuilderState(): Promise<BuilderState> {
  try {
    const raw = await readFile(statePath, 'utf8');
    const parsed = JSON.parse(raw) as Partial<BuilderState>;
    return {
      builds: Array.isArray(parsed.builds) ? parsed.builds : [],
      activeBuildId: typeof parsed.activeBuildId === 'string' ? parsed.activeBuildId : null,
    };
  } catch {
    return emptyState();
  }
}

export async function writeBuilderState(state: BuilderState): Promise<void> {
  await mkdir(dirname(statePath), { recursive: true });
  const temporaryPath = `${statePath}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(state, null, 2), 'utf8');
  await rename(temporaryPath, statePath);
}

export function getArtifactDirectory(id: string): string {
  return join(stateRoot, 'builds', id);
}
