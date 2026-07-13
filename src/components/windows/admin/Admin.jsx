import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { FONT_STACK } from '@/constants/ui'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

/**
 * Admin surface gate: shows the login form until a Supabase session exists,
 * then hands off to the dashboard. Subscribes to auth changes so the two
 * views stay in sync with the session.
 */
const Admin = () => {
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setChecking(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  if (checking) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ background: '#e8e0d4', fontFamily: FONT_STACK }}>
        <p className="text-[12px] text-[#5a5a5a]">Checking session...</p>
      </div>
    )
  }

  if (!session) {
    return <AdminLogin onLogin={() => {}} />
  }

  return <AdminDashboard onLogout={handleLogout} userEmail={session.user.email} />
}

export default Admin
