import type { Eip712TypedDataSpec } from '@web3-platform/builder-schema/eip712';

export async function requestEip712Signature(input: {
  ethereum: { request(args: { method: string; params?: unknown[] }): Promise<unknown> };
  account: string;
  typedData: Eip712TypedDataSpec;
}): Promise<string> {
  const payload = JSON.stringify(input.typedData);
  const result = await input.ethereum.request({
    method: 'eth_signTypedData_v4',
    params: [input.account, payload],
  });
  return String(result);
}
