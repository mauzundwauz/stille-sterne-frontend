'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const supabase = createClient()

export default function AdminDashboard() {
  const [data, setData] = useState<any[]>([])
  const [allMonths, setAllMonths] = useState<string[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string>('')

  useEffect(() => {
    const fetchMonths = async () => {
      const { data, error } = await supabase
        .from('order_summary')
        .select('monat')
        .order('monat', { ascending: false })

      if (!error && data) {
        const uniqueMonths = Array.from(new Set(data.map((d) => d.monat)))
        setAllMonths(uniqueMonths)
        setSelectedMonth(uniqueMonths[0])
      }
    }

    fetchMonths()
  }, [])

  useEffect(() => {
    if (!selectedMonth) return

    const fetchData = async () => {
      const { data, error } = await supabase
        .from('order_summary')
        .select('monat, anzahl_gedenkseiten, anzahl_plaketten, gesamt')
        .eq('monat', selectedMonth)

      if (!error) setData(data)
    }

    fetchData()
  }, [selectedMonth])

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.text(`Abrechnung für ${selectedMonth}`, 14, 20)

    const tableData = data.map((row) => [
      row.monat,
      row.anzahl_gedenkseiten,
      row.anzahl_plaketten,
      row.gesamt + ' €',
    ])

    autoTable(doc, {
      startY: 30,
      head: [['Monat', 'Gedenkseiten', 'Plaketten', 'Gesamt']],
      body: tableData,
    })

    doc.save(`stille-sterne-abrechnung-${selectedMonth}.pdf`)
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">📊 Admin Dashboard</h1>

      {/* Monat auswählen */}
      <div className="mb-4">
        <label htmlFor="month" className="mr-2 font-medium">Monat:</label>
        <select
          id="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border rounded px-2 py-1"
        >
          {allMonths.map((monat) => (
            <option key={monat} value={monat}>
              {monat}
            </option>
          ))}
        </select>
      </div>

      {/* Balkendiagramm */}
      <section className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
            <XAxis dataKey="monat" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="anzahl_gedenkseiten" name="Gedenkseiten" fill="#8884d8" />
            <Bar dataKey="anzahl_plaketten" name="Plaketten" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Tabelle */}
      <section className="mb-6">
        <h2 className="text-lg font-medium mb-2">📋 Übersicht</h2>
        <div className="overflow-x-auto rounded-md border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Monat</th>
                <th className="p-3">Gedenkseiten</th>
                <th className="p-3">Plaketten</th>
                <th className="p-3">Gesamt</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.monat} className="border-t">
                  <td className="p-3">{row.monat}</td>
                  <td className="p-3">{row.anzahl_gedenkseiten}</td>
                  <td className="p-3">{row.anzahl_plaketten}</td>
                  <td className="p-3">{row.gesamt} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <button
        onClick={exportToPDF}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded shadow"
      >
        📥 PDF herunterladen
      </button>
    </main>
  )
}
