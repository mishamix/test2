import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://example.supabase.co'
const supabaseAnonKey = 'demo-key'

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)