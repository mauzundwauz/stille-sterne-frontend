'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type OrderSummary = {
  id: string
  monat: string
  anzahl_gedenkseiten: number
  anzahl_plaketten: number
  summe_gedenkseiten: number
  summe_plaketten: number
  gesamt: number
  status: 'offen' | 'abgerechnet' | 'bezahlt'
  user_id: string
  bestatter_name: string // kommt aus Join
}

export default function AdminDashboard() {
  const [data, setData] = useState<OrderSummary[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('order_summary')
        .select(`
          *,
          users!inner(email)
        `)
        .order('monat', { ascending: false })

      if (error) {
        console.error(error)
        return
      }

      const parsed = data.map((item: any) => ({
        ...item,
        bestatter_name: item.users?.email ?? 'Unbekannt'
      }))

      setData(parsed)
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) return <div className="p-4">Lade Daten...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Monat</th>
              <th className="p-2 border">Bestatter</th>
              <th className="p-2 border">Gedenkseiten</th>
              <th className="p-2 border">Plaketten</th>
              <th className="p-2 border">Umsatz Seiten</th>
              <th className="p-2 border">Umsatz Plaketten</th>
              <th className="p-2 border">Gesamt</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Details</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td className="p-2 border">{row.monat}</td>
                <td className="p-2 border">{row.bestatter_name}</td>
                <td className="p-2 border text-center">{row.anzahl_gedenkseiten}</td>
                <td className="p-2 border text-center">{row.anzahl_plaketten}</td>
                <td className="p-2 border text-right">{row.summe_gedenkseiten.toFixed(2)} €</td>
                <td className="p-2 border text-right">{row.summe_plaketten.toFixed(2)} €</td>
                <td className="p-2 border text-right font-semibold">{row.gesamt.toFixed(2)} €</td>
                <td className="p-2 border capitalize">{row.status}</td>
                <td className="p-2 border text-center">
                  <Link
                    href={`/admin/bestatter/${row.user_id}`}
                    className="text-blue-600 underline text-sm"
                  >
                    Anzeigen
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
