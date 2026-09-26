export interface DomainPolicy {
  allowlist: string[];
}

export function assertDomainAllowed(policy: DomainPolicy, hostname: string): void {
  if (!policy.allowlist.includes(hostname)) {
    throw new Error(`Domain ${hostname} is not allowlisted`);
  }
}
