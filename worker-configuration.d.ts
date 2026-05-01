/* eslint-disable */
// Manually maintained — wrangler types doesn't handle multi-env well.
// Regenerate with: `wrangler types --include-runtime false --env production`
declare namespace Cloudflare {
  interface GlobalProps {
    mainModule: typeof import("./src/worker");
  }
  interface Env {
    ASSETS: Fetcher;
    AGENTCRIBS_KV: KVNamespace;
    AGENTCRIBS_R2: R2Bucket;
    SEND_EMAIL: SendEmail;
    PROCESS_APPLICATION_QUEUE: Queue;
    SEND_EMAIL_QUEUE: Queue;
    NOTIFICATION_QUEUE: Queue;
    SLACK_QUEUE: Queue;
    DEAD_LETTER_QUEUE: Queue;
    ADMIN_PASSWORD: string;
    ADMIN_COOKIE_NAME: string;
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
    GITHUB_CALLBACK_URL: string;
    SEND_EMAIL_FROM: string;
    APP_URL: string;
    SLACK_WEBHOOK_URL: string;
    CLOUDFLARE_ACCOUNT_ID: string;
    AI_GATEWAY_NAME: string;
    CF_AIG_TOKEN: string;
    LUMA_API_SECRET: string;
  }
  interface ProductionEnv extends Env {}
  interface StagingEnv extends Env {}
}
interface Env extends Cloudflare.Env {}
type StringifyValues<EnvType extends Record<string, unknown>> = {
  [Binding in keyof EnvType]: EnvType[Binding] extends string
    ? EnvType[Binding]
    : string;
};
declare namespace NodeJS {
  interface ProcessEnv extends StringifyValues<
    Pick<
      Cloudflare.Env,
      | "ADMIN_PASSWORD"
      | "ADMIN_COOKIE_NAME"
      | "GITHUB_CLIENT_ID"
      | "GITHUB_CLIENT_SECRET"
      | "GITHUB_CALLBACK_URL"
      | "SEND_EMAIL_FROM"
      | "APP_URL"
      | "SLACK_WEBHOOK_URL"
    >
  > {}
}
