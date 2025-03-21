'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@supabase/auth-helpers-react'

export default function DashboardPage() {
  const user = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user])

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Dein Dashboard ✨</h1>
      <p className="mt-4">Willkommen zurück, {user?.email}!</p>
    </main>
  )
}
