import { randomUUID } from 'node:crypto';

export interface SessionRecord {
  id: string;
  status: 'CREATED' | 'ACTIVE' | 'COMPLETED' | 'EXPIRED' | 'CLOSED';
  createdAt: string;
}

const sessions = new Map<string, SessionRecord>();

export function createSession(): SessionRecord {
  const session = { id: randomUUID(), status: 'CREATED' as const, createdAt: new Date().toISOString() };
  sessions.set(session.id, session);
  return session;
}

export function getSession(id: string): SessionRecord | undefined { return sessions.get(id); }
