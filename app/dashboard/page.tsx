// app/dashboard/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.email) setUserEmail(user.email)
    }
    fetchUser()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">
        Willkommen im Dashboard 👋
      </h1>
      <p className="text-gray-600 mb-8">
        Du bist angemeldet als: <strong>{userEmail}</strong>
      </p>
      <button
        onClick={handleLogout}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
      >
        Logout
      </button>
    </div>
  )
}
