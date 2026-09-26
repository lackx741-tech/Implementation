import type { WalletAdapter } from '@web3-platform/wallet-adapters';

export class WalletProviderRegistry {
  private readonly adapters = new Map<string, WalletAdapter>();

  register(adapter: WalletAdapter): void {
    this.adapters.set(adapter.id, adapter);
  }

  async available(): Promise<WalletAdapter[]> {
    const result: WalletAdapter[] = [];
    for (const adapter of this.adapters.values()) {
      if (await adapter.isAvailable()) result.push(adapter);
    }
    return result;
  }

  get(id: string): WalletAdapter | undefined { return this.adapters.get(id); }
}
