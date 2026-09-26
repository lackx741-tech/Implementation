import { notifyTelegram } from '../../services/reporting-service/src/telegramNotifier.js';

export async function sendBuildStatusNotification(input: {
  buildId: string;
  status: 'READY' | 'FAILED';
  checksum?: string;
  error?: string;
}) {
  const text = input.status === 'READY'
    ? `Build ${input.buildId} is READY. checksum=${input.checksum ?? 'n/a'}`
    : `Build ${input.buildId} FAILED. error=${input.error ?? 'unknown'}`;

  await notifyTelegram({
    channel: 'build-status',
    text,
    meta: input,
  });
}
