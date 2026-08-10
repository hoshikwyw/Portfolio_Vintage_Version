import StatusMessage from '@/shared/components/feedback/StatusMessage'
import { signOut } from './api/auth'
import { useSession } from './hooks/useSession'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'

/**
 * Admin surface gate: shows the login form until a Supabase session exists,
 * then hands off to the dashboard.
 */
const Admin = () => {
  const { session, isChecking } = useSession()

  if (isChecking) return <StatusMessage>Checking session...</StatusMessage>
  if (!session) return <AdminLogin />

  return <AdminDashboard onLogout={signOut} userEmail={session.user.email} />
}

export default Admin
