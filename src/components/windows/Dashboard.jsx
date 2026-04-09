import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

const Dashboard = () => {
    const [session, setSession] = useState(null)
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        // Check for existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setChecking(false)
        })

        // Listen for auth changes
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
            <div className="w-full h-full flex items-center justify-center" style={{ background: '#e8e0d4', fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
                <p className="text-[12px] text-[#5a5a5a]">Checking session...</p>
            </div>
        )
    }

    if (!session) {
        return <AdminLogin onLogin={() => {}} />
    }

    return <AdminDashboard onLogout={handleLogout} userEmail={session.user.email} />
}

export default Dashboard
