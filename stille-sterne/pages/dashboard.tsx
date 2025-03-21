import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [funerals, setFunerals] = useState([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) window.location.href = '/login'
      else loadData()
    })
  }, [])

  const loadData = async () => {
    const { data, error } = await supabase.from('funerals').select('*')
    setFunerals(data || [])
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Meine Gedenkseiten</h1>
      <ul>
        {funerals.map((f: any) => (
          <li key={f.id}>
            {f.vorname} {f.nachname} – {f.geburtsdatum} bis {f.sterbedatum}
          </li>
        ))}
      </ul>
    </div>
  )
}