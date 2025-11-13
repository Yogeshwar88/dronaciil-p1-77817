import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [canUpdate, setCanUpdate] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setCanUpdate(true)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setMsg(error.message)
    else setMsg('Password updated. Now login.')
  }

  return (
    <form onSubmit={onSubmit}>
      <h2>Set New Password</h2>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button disabled={!canUpdate}>Update password</button>
      <div>{msg}</div>
    </form>
  )
}
