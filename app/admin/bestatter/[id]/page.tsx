'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'

type DetailRow = {
  monat: string
  anzahl_gedenkseiten: number
  anzahl_plaketten: number
  summe_gedenkseiten: number
  summe_plaketten: number
  gesamt: number
  status: string
}

export default function BestatterDetail() {
  const supabase = createClient()
  const { id } = useParams()
  const [data, setData] = useState<DetailRow[]>([])
  const [bestatterName, setBestatterName] = useState<string>('...')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchDetails = async () => {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('id', id)
        .single()

      if (!userError) {
        setBestatterName(user.email)
      }

      const { data: summary, error } = await supabase
        .from('order_summary')
        .select('*')
        .eq('user_id', id)
        .order('monat', { ascending: false })

      if (error) {
        console.error(error)
        return
      }

      setData(summary)
      setLoading(false)
    }

    fetchDetails()
  }, [id])

  if (loading) return <div className="p-4">Lade Daten...</div>

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Details für {bestatterName}</h1>
      <table className="min-w-full bg-white border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Monat</th>
            <th className="p-2 border">Gedenkseiten</th>
            <th className="p-2 border">Plaketten</th>
            <th className="p-2 border">Umsatz Seiten</th>
            <th className="p-2 border">Umsatz Plaketten</th>
            <th className="p-2 border">Gesamt</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.monat}>
              <td className="p-2 border">{entry.monat}</td>
              <td className="p-2 border text-center">{entry.anzahl_gedenkseiten}</td>
              <td className="p-2 border text-center">{entry.anzahl_plaketten}</td>
              <td className="p-2 border text-right">{entry.summe_gedenkseiten.toFixed(2)} €</td>
              <td className="p-2 border text-right">{entry.summe_plaketten.toFixed(2)} €</td>
              <td className="p-2 border text-right font-semibold">{entry.gesamt.toFixed(2)} €</td>
              <td className="p-2 border capitalize">{entry.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
