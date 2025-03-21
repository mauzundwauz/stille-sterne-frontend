import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    redirectTo: 'https://stille-sterne-frontend.vercel.app/dashboard',
  },
})

export default supabase
