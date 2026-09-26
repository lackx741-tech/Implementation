export interface Job<T = unknown> {
  id: string;
  type: string;
  payload: T;
  attempts: number;
}

export function processTransactionJob(job: Job): { id: string; status: 'QUEUED' } {
  // Deliberately a placeholder: production submission requires an explicit
  // implementation, review, network adapter, and user-visible confirmation.
  return { id: job.id, status: 'QUEUED' };
}
