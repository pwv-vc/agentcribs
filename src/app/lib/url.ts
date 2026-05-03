export const APP_URL = "https://agentcribs.com";

export function getAppUrl(appUrl?: string) {
  return appUrl || APP_URL;
}
