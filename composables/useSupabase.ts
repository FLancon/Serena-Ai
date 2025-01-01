import { createClient } from '@supabase/supabase-js'
import { useRuntimeConfig } from '#app'

let client = null

export const useSupabaseClient = () => {
  if (!client) {
    const config = useRuntimeConfig()
    client = createClient(
      config.public.SUPABASE_URL,
      config.public.SUPABASE_KEY
    )
  }
  return client
}