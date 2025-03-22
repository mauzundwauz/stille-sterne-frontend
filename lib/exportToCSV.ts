export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) return

  const headers = Object.keys(data[0])
  const rows = data.map(row =>
    headers.map(field => `"${(row[field] ?? '').toString().replace(/"/g, '""')}"`).join(',')
  )

  const csvContent = [headers.join(','), ...rows].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
