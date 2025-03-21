'use client'

import React from 'react'

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Willkommen beim Stille Sterne Dashboard ✨
        </h1>
        <p className="text-gray-600 mb-8">
          Hier verwalten Sie Gedenkseiten, QR-Plaketten und Ihre Bestellungen.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Gedenkseiten</h2>
            <p className="text-gray-500 text-sm mb-4">Erstellen, verwalten und bearbeiten Sie Gedenkseiten für Verstorbene.</p>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
              Neue Gedenkseite
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">QR-Plaketten</h2>
            <p className="text-gray-500 text-sm mb-4">Behalten Sie den Überblick über bestellte und versendete QR-Codes.</p>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
              Plakette anfordern
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Statistik & Abrechnung</h2>
            <p className="text-gray-500 text-sm mb-4">Sehen Sie Ihre aktuellen Nutzungszahlen und Umsätze.</p>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
              Übersicht öffnen
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
