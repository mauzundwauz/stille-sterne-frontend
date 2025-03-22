import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

type PDFInput = {
  name: string
  monat: string
  anzahlGedenkseiten: number
  anzahlPlaketten: number
  preisGedenkseite: number
  preisPlakette: number
  gesamtSumme: number
  status: 'offen' | 'abgerechnet' | 'bezahlt'
}

export async function generatePDFDocument(data: PDFInput): Promise<Blob> {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842])
  const { width, height } = page.getSize()

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontSize = 12

  let cursorY = height - 50

  page.drawText('Stille Sterne - Monatsabrechnung', {
    x: 50,
    y: cursorY,
    size: 18,
    font,
    color: rgb(0, 0.53, 0.71),
  })

  cursorY -= 40

  const lines = [
    `Bestatter: ${data.name}`,
    `Monat: ${data.monat}`,
    `Gedenkseiten: ${data.anzahlGedenkseiten} x ${data.preisGedenkseite} €`,
    `Plaketten: ${data.anzahlPlaketten} x ${data.preisPlakette} €`,
    `Gesamtsumme: ${data.gesamtSumme.toFixed(2)} €`,
    `Status: ${data.status}`,
  ]

  lines.forEach((line) => {
    page.drawText(line, {
      x: 50,
      y: cursorY,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    })
    cursorY -= 20
  })

  const pdfBytes = await pdfDoc.save()
  return new Blob([pdfBytes], { type: 'application/pdf' })
}
