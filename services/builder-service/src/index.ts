import { createHash, randomUUID } from 'node:crypto';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { BuildArtifact, BuilderConfig } from './types.js';

const inMemory = new Map<string, BuildArtifact>();

function now() {
  return new Date().toISOString();
}

function validateConfig(input: BuilderConfig): string[] {
  const errors: string[] = [];
  if (!input.name?.trim()) errors.push('name is required');
  if (!input.version?.trim()) errors.push('version is required');
  if (!Array.isArray(input.domainAllowlist) || input.domainAllowlist.length === 0) errors.push('domainAllowlist is required');
  if (input.eip712.enabled) {
    if (!input.eip712.domainName) errors.push('eip712.domainName is required');
    if (!input.eip712.domainVersion) errors.push('eip712.domainVersion is required');
    if (!Number.isInteger(input.eip712.chainId) || input.eip712.chainId <= 0) errors.push('eip712.chainId must be a positive integer');
  }
  return errors;
}

function compileScript(config: BuilderConfig): string {
  // Safe generated client artifact: preview + explicit user action only.
  return `/* generated script: ${config.name}@${config.version} */
(() => {
  const ALLOWED_DOMAINS = ${JSON.stringify(config.domainAllowlist)};
  const current = window.location.hostname;
  if (!ALLOWED_DOMAINS.includes(current)) {
    console.warn('[builder] domain not allowlisted', current);
    return;
  }

  const state = {
    config: ${JSON.stringify(config)},
    ready: true,
  };

  window.SafeBuilderRuntime = {
    version: '${config.version}',
    getConfig: () => state.config,
    showPreview: (payload) => {
      console.log('[builder] preview payload', payload);
      return payload;
    },
    requestUserAction: async (label = 'Confirm action') => {
      const ok = window.confirm(label + '\n\nThis request is user-initiated and reviewable.');
      if (!ok) throw new Error('User rejected action');
      return true;
    }
  };
})();`;
}

function compileManifest(config: BuilderConfig, script: string) {
  const checksum = createHash('sha256').update(script).digest('hex');
  return {
    name: config.name,
    version: config.version,
    createdAt: now(),
    checksum,
    modules: config.modules,
    domainAllowlist: config.domainAllowlist,
    eip712: config.eip712,
  };
}

export async function createBuild(config: BuilderConfig): Promise<BuildArtifact> {
  const errors = validateConfig(config);
  if (errors.length) {
    return {
      id: randomUUID(),
      status: 'FAILED',
      config,
      createdAt: now(),
      updatedAt: now(),
      error: errors.join('; '),
    };
  }

  const id = randomUUID();
  const artifact: BuildArtifact = {
    id,
    status: 'COMPILING',
    config,
    createdAt: now(),
    updatedAt: now(),
  };
  inMemory.set(id, artifact);

  try {
    const script = compileScript(config);
    const manifest = compileManifest(config, script);
    const scriptPath = join('artifacts', 'builds', id, 'script.js');
    const manifestPath = join('artifacts', 'builds', id, 'manifest.json');

    await mkdir(dirname(scriptPath), { recursive: true });
    await writeFile(scriptPath, script, 'utf8');
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

    const ready: BuildArtifact = {
      ...artifact,
      status: 'READY',
      scriptPath,
      manifestPath,
      checksum: manifest.checksum,
      updatedAt: now(),
    };
    inMemory.set(id, ready);
    return ready;
  } catch (error) {
    const failed: BuildArtifact = {
      ...artifact,
      status: 'FAILED',
      updatedAt: now(),
      error: error instanceof Error ? error.message : 'Unknown compile error',
    };
    inMemory.set(id, failed);
    return failed;
  }
}

export function getBuild(id: string): BuildArtifact | undefined {
  return inMemory.get(id);
}

export function listBuilds(): BuildArtifact[] {
  return [...inMemory.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
