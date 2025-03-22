
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'admin' | 'subadmin' | 'bestatter' | 'angehoeriger'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role: 'admin' | 'subadmin' | 'bestatter' | 'angehoeriger'
          created_at?: string
        }
        Update: {
          email?: string
          role?: 'admin' | 'subadmin' | 'bestatter' | 'angehoeriger'
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          lizenz_typ: string
          status: string
          startdatum: string
          endedatum: string | null
          preis_pro_monat: number
          rechnungsintervall: string
          letzte_rechnung_am: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lizenz_typ: string
          status: string
          startdatum: string
          endedatum?: string | null
          preis_pro_monat: number
          rechnungsintervall: string
          letzte_rechnung_am?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          lizenz_typ?: string
          status?: string
          endedatum?: string | null
          preis_pro_monat?: number
          rechnungsintervall?: string
          letzte_rechnung_am?: string
          updated_at?: string
        }
      }
      order_summary: {
        Row: {
          id: string
          user_id: string
          monat: string
          anzahl_gedenkseiten: number
          anzahl_plaketten: number
          summe_gedenkseiten: number
          summe_plaketten: number
          gesamt: number
          status: 'offen' | 'abgerechnet' | 'bezahlt'
          erstellt_am: string
        }
        Insert: {
          id?: string
          user_id: string
          monat: string
          anzahl_gedenkseiten: number
          anzahl_plaketten: number
          summe_gedenkseiten: number
          summe_plaketten: number
          gesamt: number
          status: 'offen' | 'abgerechnet' | 'bezahlt'
          erstellt_am?: string
        }
        Update: {
          anzahl_gedenkseiten?: number
          anzahl_plaketten?: number
          summe_gedenkseiten?: number
          summe_plaketten?: number
          gesamt?: number
          status?: 'offen' | 'abgerechnet' | 'bezahlt'
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
