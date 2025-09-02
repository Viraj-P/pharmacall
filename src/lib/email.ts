import { Resend } from "resend";
import { getEnv } from "@/lib/env";

const resend = new Resend(getEnv().RESEND_API_KEY);

export async function sendAuditEmail(params: {
  to: string;
  subject: string;
  html: string;
  attachments?: { filename: string; content: Buffer }[];
}) {
  const { to, subject, html, attachments } = params;
  const result = await resend.emails.send({ to, subject, html, attachments, from: "reports@local-seo.app" });
  if ((result as any).error) throw (result as any).error;
  return result;
}
