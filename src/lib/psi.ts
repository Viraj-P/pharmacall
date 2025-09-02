import { getEnv } from "@/lib/env";

export type PSiCategory = "performance" | "accessibility" | "best-practices" | "seo";

export interface PageSpeedResult {
  lighthouseResult?: any;
}

export async function fetchPageSpeed(url: string, categories: PSiCategory[] = ["performance"]) {
  const key = getEnv().PAGESPEED_API_KEY;
  const params = new URLSearchParams({ url });
  for (const c of categories) params.append("category", c);
  if (key) params.set("key", key);
  const resp = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`);
  if (!resp.ok) throw new Error(`PSI failed: ${resp.status}`);
  return (await resp.json()) as PageSpeedResult;
}
