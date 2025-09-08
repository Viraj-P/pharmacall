import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gludecsofmdzvbmvjxoc.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsdWRlY3NvZm1kenZibXZqeG9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxODkyMzUsImV4cCI6MjA3Mjc2NTIzNX0.eMSfKVRUG5etDaUeYchqSlW5TehmeFLrXPvY15UbZa8'
  
  return createBrowserClient(supabaseUrl, supabaseKey)
}
