export interface Eip712DomainSpec {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: string;
}

export interface Eip712TypeField {
  name: string;
  type: string;
}

export interface Eip712TypedDataSpec {
  domain: Eip712DomainSpec;
  primaryType: string;
  types: Record<string, Eip712TypeField[]>;
  message: Record<string, unknown>;
}

export function validateDomain(domain: Eip712DomainSpec): string[] {
  const errors: string[] = [];
  if (!domain.name?.trim()) errors.push('domain.name is required');
  if (!domain.version?.trim()) errors.push('domain.version is required');
  if (!Number.isInteger(domain.chainId) || domain.chainId <= 0) errors.push('domain.chainId must be a positive integer');
  if (!/^0x[a-fA-F0-9]{40}$/.test(domain.verifyingContract)) errors.push('domain.verifyingContract must be a valid address');
  return errors;
}

export function validateTypedData(data: Eip712TypedDataSpec): string[] {
  const errors = validateDomain(data.domain);
  if (!data.primaryType?.trim()) errors.push('primaryType is required');
  if (!data.types || !data.types[data.primaryType]) errors.push('types must include the primaryType definition');
  return errors;
}
