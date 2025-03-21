'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import Link from 'next/link'

type DashboardRow = {
  user_id: string
  email: string
  anzahl_gedenkseiten: number
  anzahl_plaketten: number
  summe_gedenkseiten: number
  summe_plaketten: number
  gesamt: number
  status: string
  monat: string
}

export default function AdminDashboard() {
  const supabase = createClient()
  const [data, setData] = useState<DashboardRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.rpc('admin_dashboard_view') // siehe Hinweis unten

      if (error) {
        console.error(error)
      } else {
        setData(data)
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) return <div className="p-4">Lade Dashboard...</div>

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📊 Admin Dashboard</h1>
      <table className="min-w-full border border-gray-300 text-sm bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Bestatter</th>
            <th className="p-2 border">Monat</th>
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
            <tr key={row.user_id + row.monat}>
              <td className="p-2 border">{row.email}</td>
              <td className="p-2 border text-center">{row.monat}</td>
              <td className="p-2 border text-center">{row.anzahl_gedenkseiten}</td>
              <td className="p-2 border text-center">{row.anzahl_plaketten}</td>
              <td className="p-2 border text-right">{row.summe_gedenkseiten.toFixed(2)} €</td>
              <td className="p-2 border text-right">{row.summe_plaketten.toFixed(2)} €</td>
              <td className="p-2 border text-right font-semibold">{row.gesamt.toFixed(2)} €</td>
              <td className="p-2 border capitalize">{row.status}</td>
              <td className="p-2 border text-center">
                <Link href={`/admin/bestatter/${row.user_id}`} className="text-blue-600 underline">
                  Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
