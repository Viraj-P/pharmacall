import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().default("https://placeholder.supabase.co"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).default("placeholder-key"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  RESEND_API_KEY: z.string().min(1).default("placeholder-key"),

  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  SENTRY_AUTH_TOKEN: z.string().min(1).optional(),

  PAGESPEED_API_KEY: z.string().min(1).optional(),

  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

export type AppEnv = z.infer<typeof envSchema>;

let cachedEnv: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (cachedEnv) return cachedEnv;
  
  // Log environment variables for debugging (remove in production)
  console.log('Environment check:', {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasResendKey: !!process.env.RESEND_API_KEY,
    hasPagespeedKey: !!process.env.PAGESPEED_API_KEY,
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
  });

  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    PAGESPEED_API_KEY: process.env.PAGESPEED_API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!parsed.success) {
    console.error("Environment validation failed:", parsed.error.issues);
    
    // Check if we're in production and have critical missing variables
    if (process.env.NODE_ENV === 'production') {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error("CRITICAL: Missing Supabase environment variables in production!");
      }
    }
    
    // For development/build, use defaults
    cachedEnv = envSchema.parse({});
    return cachedEnv;
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}
