import { DappRuntime } from './runtime/DappRuntime';

export function bootDapp(root: HTMLElement): DappRuntime {
  const runtime = new DappRuntime();
  runtime.mount(root);
  return runtime;
}
