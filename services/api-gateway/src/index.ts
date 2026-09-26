import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';
import { createSession, getSession } from '../../session-service/src/index.js';
import { createPreviewWorkflow } from '../../workflow-service/src/index.js';
import { createBuild, getBuild, listBuilds } from '../../builder-service/src/index.js';
import type { BuilderConfig } from '../../builder-service/src/types.js';

const port = Number(process.env.PORT ?? 3000);

function json(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

async function body(req: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as Record<string, unknown>;
}

const defaultTemplate = {
  id: 'default-preview', name: 'Default preview workflow', version: '1.0.0',
  build: ({ chainId, recipient }: { chainId: string; recipient: string }) => [{
    chainId, to: recipient, value: '0', data: '0x', description: 'Reviewable application interaction',
  }],
};

async function route(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const method = req.method ?? 'GET';
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);

  if (method === 'GET' && url.pathname === '/health') {
    json(res, 200, { status: 'ok', service: 'api-gateway', time: new Date().toISOString() }); return;
  }
  if (method === 'POST' && url.pathname === '/api/v1/sessions') {
    json(res, 201, { session: createSession() }); return;
  }
  const sessionMatch = url.pathname.match(/^\/api\/v1\/sessions\/([^/]+)$/);
  if (method === 'GET' && sessionMatch) {
    const session = getSession(sessionMatch[1]);
    session ? json(res, 200, { session }) : json(res, 404, { error: { code: 'SESSION_NOT_FOUND' } }); return;
  }
  if (method === 'POST' && url.pathname === '/api/v1/workflows') {
    const input = await body(req);
    const sessionId = String(input.sessionId ?? '');
    const chainId = String(input.chainId ?? '');
    const recipient = String(input.recipient ?? '');
    if (!sessionId || !chainId || !recipient) {
      json(res, 400, { error: { code: 'INVALID_WORKFLOW_REQUEST', message: 'sessionId, chainId, and recipient are required' } }); return;
    }
    json(res, 201, { workflow: createPreviewWorkflow({ sessionId, chainId, recipient, template: defaultTemplate }) }); return;
  }
  if (method === 'POST' && url.pathname === '/api/v1/builder/builds') {
    const input = await body(req);
    const artifact = await createBuild(input as unknown as BuilderConfig);
    json(res, artifact.status === 'FAILED' ? 400 : 201, { artifact }); return;
  }
  if (method === 'GET' && url.pathname === '/api/v1/builder/builds') {
    json(res, 200, { builds: listBuilds() }); return;
  }
  const buildMatch = url.pathname.match(/^\/api\/v1\/builder\/builds\/([^/]+)$/);
  if (method === 'GET' && buildMatch) {
    const artifact = getBuild(buildMatch[1]);
    artifact ? json(res, 200, { artifact }) : json(res, 404, { error: { code: 'BUILD_NOT_FOUND' } }); return;
  }
  if (method === 'POST' && url.pathname === '/api/v1/transactions/signed') {
    const input = await body(req);
    json(res, 202, { accepted: true, submissionId: randomUUID(), workflowId: input.workflowId ?? null, status: 'QUEUED' }); return;
  }
  json(res, 404, { error: { code: 'NOT_FOUND', requestId: randomUUID() } });
}

createServer((req, res) => {
  route(req, res).catch((error: unknown) => {
    console.error(error);
    json(res, 500, { error: { code: 'INTERNAL_ERROR', requestId: randomUUID() } });
  });
}).listen(port, () => console.log(`API gateway listening on ${port}`));
