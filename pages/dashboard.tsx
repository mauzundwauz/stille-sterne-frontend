import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/')
      } else {
        setUser(data.user)
      }
    })
  }, [])

  return (
    <main style={{ padding: '2rem' }}>
      <h1>🎛️ Dashboard</h1>
      {user ? <p>Willkommen, {user.email}</p> : <p>Lade Benutzer...</p>}
    </main>
  )
}
