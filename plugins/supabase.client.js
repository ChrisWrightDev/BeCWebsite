import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const supabaseUrl = config.supabaseUrl
  const supabaseAnonKey = config.supabaseAnonKey

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      '[supabase] Missing NUXT_SUPABASE_URL or NUXT_SUPABASE_ANON_KEY environment variables.'
    )
    nuxtApp.provide('supabase', null)
    return
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  nuxtApp.provide('supabase', supabase)
})

