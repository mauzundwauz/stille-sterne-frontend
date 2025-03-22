'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import StatusDropdown from '@/components/dashboard/StatusDropdown'

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
  const session = useSession()
  const router = useRouter()
  const [data, setData] = useState<BestatterUebersicht[]>([])
  const [monat, setMonat] = useState('2025-03')

  useEffect(() => {
    if (!session) {
      router.push('/login')
      return
    }

    // 👇 Beispiel-Daten (später aus Supabase laden)
    setData([
      {
        id: '1',
        name: 'Bestatter Müller GmbH',
        anzahl_gedenkseiten: 12,
        anzahl_plaketten: 9,
        umsatz_gedenkseiten: 120,
        umsatz_plaketten: 135,
        gesamt: 255,
        status: 'offen',
      },
      {
        id: '2',
        name: 'Ruhe & Licht Bestattungen',
        anzahl_gedenkseiten: 8,
        anzahl_plaketten: 8,
        umsatz_gedenkseiten: 80,
        umsatz_plaketten: 120,
        gesamt: 200,
        status: 'abgerechnet',
      },
    ])
  }, [session])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">📊 Monatsübersicht – {monat}</h1>

      <div className="mb-6">
        <label htmlFor="monat" className="mr-2 font-medium">Monat:</label>
        <input
          type="month"
          id="monat"
          value={monat}
          onChange={(e) => setMonat(e.target.value)}
          className="border rounded px-3 py-1"
        />
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Bestatter</th>
            <th>Anz. Gedenkseiten</th>
            <th>Anz. QR-Plaketten</th>
            <th>Umsatz Gedenkseiten</th>
            <th>Umsatz Plaketten</th>
            <th>Gesamt</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((eintrag) => (
            <tr key={eintrag.id} className="border-t">
              <td className="p-2">{eintrag.name}</td>
              <td className="text-center">{eintrag.anzahl_gedenkseiten}</td>
              <td className="text-center">{eintrag.anzahl_plaketten}</td>
              <td className="text-center">{eintrag.umsatz_gedenkseiten} €</td>
              <td className="text-center">{eintrag.umsatz_plaketten} €</td>
              <td className="text-center font-semibold">{eintrag.gesamt} €</td>
              <td className="text-center">
                <StatusDropdown bestatterId={eintrag.id} status={eintrag.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
