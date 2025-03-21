'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'
import Link from 'next/link'

type Summary = {
  monat: string
  anzahl_gedenkseiten: number
  anzahl_plaketten: number
  summe_gedenkseiten: number
  summe_plaketten: number
  gesamt: number
  status: string
}

export default function BestatterDetailPage() {
  const supabase = createClient()
  const { id } = useParams()
  const [data, setData] = useState<Summary[]>([])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchDetails = async () => {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('id', id)
        .single()

      if (userData) setEmail(userData.email)

      const { data, error } = await supabase
        .from('order_summary')
        .select('*')
        .eq('user_id', id)
        .order('monat', { ascending: false })

      if (error) {
        console.error(error)
      } else {
        setData(data)
      }

      setLoading(false)
    }

    fetchDetails()
  }, [id])

  if (loading) return <div className="p-4">Lade Daten...</div>

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-2">📋 Monatsübersicht für: {email}</h1>
      <Link href="/admin/dashboard" className="text-sm text-blue-600 underline mb-4 inline-block">← Zurück zum Dashboard</Link>
      <table className="min-w-full border border-gray-300 text-sm bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Monat</th>
            <th className="p-2 border">Gedenkseiten</th>
            <th className="p-2 border">Plaketten</th>
            <th className="p-2 border">Seiten €</th>
            <th className="p-2 border">Plaketten €</th>
            <th className="p-2 border">Gesamt €</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.monat}>
              <td className="p-2 border text-center">{row.monat}</td>
              <td className="p-2 border text-center">{row.anzahl_gedenkseiten}</td>
              <td className="p-2 border text-center">{row.anzahl_plaketten}</td>
              <td className="p-2 border text-right">{row.summe_gedenkseiten.toFixed(2)} €</td>
              <td className="p-2 border text-right">{row.summe_plaketten.toFixed(2)} €</td>
              <td className="p-2 border text-right font-semibold">{row.gesamt.toFixed(2)} €</td>
              <td className="p-2 border capitalize">{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
