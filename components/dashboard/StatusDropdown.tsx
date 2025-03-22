"use client"

import { useState } from "react"
import { updateOrderStatus } from "@/lib/actions"

type Status = "offen" | "abgerechnet" | "bezahlt"

interface Props {
  initialStatus: Status
  summaryId: string
}

export default function StatusDropdown({ initialStatus, summaryId }: Props) {
  const [status, setStatus] = useState<Status>(initialStatus)
  const [loading, setLoading] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Status
    setLoading(true)
    const success = await updateOrderStatus(summaryId, newStatus)
    if (success) setStatus(newStatus)
    setLoading(false)
  }

  return (
    <select
      className="border rounded px-2 py-1 text-sm"
      value={status}
      onChange={handleChange}
      disabled={loading}
    >
      <option value="offen">🟡 Offen</option>
      <option value="abgerechnet">🟠 Abgerechnet</option>
      <option value="bezahlt">🟢 Bezahlt</option>
    </select>
  )
}
