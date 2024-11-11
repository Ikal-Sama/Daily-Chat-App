import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '../types/supabase'

export async function supabaseServer() {
  const cookieStore = await cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL! // No NEXT_PUBLIC_ prefix
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // No NEXT_PUBLIC_ prefix

  return createServerClient<Database>(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}