import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminLogin({ onLogin }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [shake, setShake] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        // Supabase Auth requires email — append domain to username
        const { error: authError } = await supabase.auth.signInWithPassword({
            email: username.includes('@') ? username : `${username}@kayv.os`,
            password,
        })

        setLoading(false)

        if (authError) {
            setError(authError.message)
            setShake(true)
            setTimeout(() => setShake(false), 500)
        } else {
            onLogin()
        }
    }

    return (
        <div className="w-full h-full flex items-center justify-center" style={{ background: '#e8e0d4', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            <div
                className={shake ? 'animate-shake' : ''}
                style={{
                    width: 300,
                    background: '#c0b8a8',
                    border: '2px solid #8a8070',
                    borderTopColor: '#e0d8c8',
                    borderLeftColor: '#e0d8c8',
                    borderRadius: '4px',
                    boxShadow: '3px 3px 8px rgba(0,0,0,0.2)',
                }}
            >
                {/* Title bar */}
                <div className="px-2 py-1" style={{ background: 'linear-gradient(180deg, #4a4a6a, #2b2b3d)' }}>
                    <span className="text-[11px] font-bold text-[#e0d8c8] uppercase tracking-wide flex items-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                        Admin Login
                    </span>
                </div>

                <form onSubmit={handleSubmit} className="p-4" autoComplete="off" data-lpignore="true" data-form-type="other">
                    <p className="text-[11px] text-[#2b2b3d] mb-3">Enter your admin credentials to access the dashboard.</p>

                    {error && (
                        <div className="mb-3 px-2 py-1.5 text-[10px] text-[#8a2020] font-semibold" style={{ background: '#e8c8c8', border: '1px solid #c08080', borderRadius: '2px' }}>
                            {error}
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="block text-[10px] font-bold text-[#2b2b3d] uppercase tracking-wide mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full text-[12px] text-[#2b2b3d] outline-none px-2 py-1.5"
                            style={{ border: '2px inset #a0a090', background: '#f0ebe3', borderRadius: '1px' }}
                            autoComplete="one-time-code"
                            name={`x-${Date.now()}`}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-[10px] font-bold text-[#2b2b3d] uppercase tracking-wide mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full text-[12px] text-[#2b2b3d] outline-none px-2 py-1.5"
                            style={{ border: '2px inset #a0a090', background: '#f0ebe3', borderRadius: '1px' }}
                            autoComplete="new-password"
                            name={`p-${Date.now()}`}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-1 text-[11px] font-bold text-[#2b2b3d] cursor-pointer hover:brightness-105 active:brightness-95 uppercase tracking-wide disabled:opacity-50"
                            style={{
                                background: 'linear-gradient(180deg, #d0c8b8, #b0a898)',
                                border: '2px solid #7a7060',
                                borderTopColor: '#e0d8c8',
                                borderLeftColor: '#e0d8c8',
                                borderRadius: '3px',
                            }}
                        >
                            {loading ? 'Signing in...' : 'Login'}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20% { transform: translateX(-8px); }
                    40% { transform: translateX(8px); }
                    60% { transform: translateX(-4px); }
                    80% { transform: translateX(4px); }
                }
                .animate-shake { animation: shake 0.4s ease; }
            `}</style>
        </div>
    )
}
