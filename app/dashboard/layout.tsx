// app/dashboard/layout.tsx
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Stille Sterne – Dashboard',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: () => cookieStore,
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const allowedRoles = ['admin', 'subadmin', 'bestatter']

  if (!profile || !allowedRoles.includes(profile.role)) {
    redirect('/login') // Optional: eigene Fehlerseite anzeigen
  }

  return (
    <section>
      {/* Optional: Header/Navigation */}
      {children}
    </section>
  )
}
