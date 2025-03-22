'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Session } from '@supabase/auth-js'
import { format } from 'date-fns'
import type { Database } from '@/types/supabase'
import { exportToCSV } from '@/lib/exportToCSV'

type BestatterUebersicht = {
  id: string
  name: string
  anzahl_gedenkseiten: number
  anzahl_plaketten: number
  umsatz_gedenkseiten: number
  umsatz_plaketten: number
  gesamt: number
  status: 'offen' | 'abgerechnet' | 'bezahlt'
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createBrowserClient<Database>()
  const [session, setSession] = useState<Session | null>(null)
  const [monat, setMonat] = useState<string>(format(new Date(), 'yyyy-MM'))
  const [data, setData] = useState<BestatterUebersicht[]>([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })
  }, [])

  useEffect(() => {
    if (!session) return
    loadDataFromSupabase(monat)
  }, [session, monat])

  async function loadDataFromSupabase(monat: string) {
    const { data, error } = await supabase
      .from('order_summary')
      .select('user_id, monat, anzahl_gedenkseiten, anzahl_plaketten, summe_gedenkseiten, summe_plaketten, gesamt, status, users(name)')
      .eq('monat', monat)

    if (error) {
      console.error('Fehler beim Laden der Daten:', error)
      return
    }

    const transformed = data.map((row: any) => ({
      id: row.user_id,
      name: row.users?.name || 'Unbekannt',
      anzahl_gedenkseiten: row.anzahl_gedenkseiten,
      anzahl_plaketten: row.anzahl_plaketten,
      umsatz_gedenkseiten: row.summe_gedenkseiten,
      umsatz_plaketten: row.summe_plaketten,
      gesamt: row.gesamt,
      status: row.status
    }))
    setData(transformed)
  }

  const handleStatusChange = async (userId: string, newStatus: string) => {
    await supabase
      .from('order_summary')
      .update({ status: newStatus })
      .eq('user_id', userId)
      .eq('monat', monat)
    loadDataFromSupabase(monat)
  }

  if (!session) {
    router.push('/login')
    return null
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">📊 Admin Dashboard</h1>

      <div className="mb-6 flex items-center gap-4">
        <label htmlFor="monat">Monat:</label>
        <input
          id="monat"
          type="month"
          value={monat}
          onChange={(e) => setMonat(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={() => exportToCSV(data, `Abrechnung_${monat}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          📄 CSV herunterladen
        </button>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Bestatter</th>
            <th className="border p-2">Gedenkseiten</th>
            <th className="border p-2">Plaketten</th>
            <th className="border p-2">Umsatz Gedenkseiten</th>
            <th className="border p-2">Umsatz Plaketten</th>
            <th className="border p-2">Gesamt</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td className="border p-2">{row.name}</td>
              <td className="border p-2 text-center">{row.anzahl_gedenkseiten}</td>
              <td className="border p-2 text-center">{row.anzahl_plaketten}</td>
              <td className="border p-2 text-right">{row.umsatz_gedenkseiten.toFixed(2)} €</td>
              <td className="border p-2 text-right">{row.umsatz_plaketten.toFixed(2)} €</td>
              <td className="border p-2 text-right font-semibold">{row.gesamt.toFixed(2)} €</td>
              <td className="border p-2">
                <select
                  value={row.status}
                  onChange={(e) => handleStatusChange(row.id, e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="offen">🟡 Offen</option>
                  <option value="abgerechnet">🟠 Abgerechnet</option>
                  <option value="bezahlt">🟢 Bezahlt</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
