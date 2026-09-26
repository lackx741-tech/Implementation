export interface TelegramNotification {
  channel: 'build-status' | 'ops-alerts';
  text: string;
  meta?: Record<string, unknown>;
}

export async function notifyTelegram(payload: TelegramNotification): Promise<void> {
  // Safe baseline: console notification only.
  // Production implementation should call a dedicated notification webhook with
  // strict allowlist, auth, retry policy, and message templates.
  console.log('[telegram-notify]', JSON.stringify(payload));
}
