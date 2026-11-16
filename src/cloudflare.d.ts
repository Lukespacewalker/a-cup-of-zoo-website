// Keep Workers runtime types separate from the browser DOM globals.
type Fetcher = import("@cloudflare/workers-types").Fetcher;
type DurableObjectNamespace<
  T extends import("@cloudflare/workers-types").Rpc.DurableObjectBranded,
> = import("@cloudflare/workers-types").DurableObjectNamespace<T>;
type ExecutionContext = import("@cloudflare/workers-types").ExecutionContext;
type ExportedHandler<Env> =
  import("@cloudflare/workers-types").ExportedHandler<Env>;

declare module "cloudflare:workers" {
  export const env: Cloudflare.Env;
  export const DurableObject: typeof import("@cloudflare/workers-types").CloudflareWorkersModule.DurableObject;
}
