import { useState } from 'react'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

const Dashboard = () => {
    const [authenticated, setAuthenticated] = useState(false)

    if (!authenticated) {
        return <AdminLogin onLogin={() => setAuthenticated(true)} />
    }

    return <AdminDashboard />
}

export default Dashboard
