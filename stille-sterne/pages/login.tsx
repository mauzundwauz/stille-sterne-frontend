import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email })
    setMessage(error ? 'Fehler beim Login' : 'E-Mail zum Einloggen gesendet!')
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <input
        type="email"
        placeholder="E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full"
      />
      <button onClick={handleLogin} className="mt-4 bg-blue-500 text-white px-4 py-2">
        Login-Link senden
      </button>
      <p className="mt-4">{message}</p>
    </div>
  )
}