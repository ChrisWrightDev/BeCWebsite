import { createClient } from '@supabase/supabase-js'

export function useSupabaseAdmin() {
  const config = useRuntimeConfig()

  if (!config.supabaseUrl || !config.supabaseServiceRoleKey) {
    throw createError({
      statusCode: 500,
      statusMessage:
        'Server is not configured: add NUXT_SUPABASE_URL and NUXT_SUPABASE_SERVICE_ROLE_KEY to your .env'
    })
  }

  return createClient(config.supabaseUrl, config.supabaseServiceRoleKey)
}
