import { useState, useEffect } from 'react'

const STORAGE_KEY = 'kayv-welcomed'

export default function WelcomeDialog({ onOpenWindow }) {
    const [show, setShow] = useState(false)

    useEffect(() => {
        if (!sessionStorage.getItem(STORAGE_KEY)) {
            const timer = setTimeout(() => setShow(true), 600)
            return () => clearTimeout(timer)
        }
    }, [])

    if (!show) return null

    const handleOK = () => {
        sessionStorage.setItem(STORAGE_KEY, '1')
        setShow(false)
    }

    const handleOpen = (name) => {
        sessionStorage.setItem(STORAGE_KEY, '1')
        setShow(false)
        onOpenWindow(name)
    }

    return (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
            <div
                style={{
                    width: 340,
                    background: 'var(--os-window)',
                    border: '2px solid var(--os-border-dark)',
                    borderTopColor: 'var(--os-border-light)',
                    borderLeftColor: 'var(--os-border-light)',
                    borderRadius: 'var(--os-window-radius)',
                    boxShadow: 'var(--os-window-shadow)',
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    backdropFilter: 'var(--os-glass-blur)',
                    WebkitBackdropFilter: 'var(--os-glass-blur)',
                }}
            >
                {/* Title bar */}
                <div
                    className="flex items-center justify-between px-2 py-1"
                    style={{ background: 'var(--os-titlebar)', borderRadius: 'calc(var(--os-window-radius) - 2px) calc(var(--os-window-radius) - 2px) 0 0' }}
                >
                    <span className="text-[11px] font-bold text-[#e0d8c8] uppercase tracking-wide">Welcome</span>
                    <button
                        onClick={handleOK}
                        className="w-4 h-4 flex items-center justify-center text-[#e0d8c8] hover:text-white cursor-pointer"
                        style={{
                            background: 'linear-gradient(180deg, #6a6a7a, #4a4a5a)',
                            border: '1px solid #2a2a3a',
                            borderTopColor: '#8a8a9a',
                            borderLeftColor: '#8a8a9a',
                            borderRadius: '2px',
                            fontSize: '10px',
                            lineHeight: 1,
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    <div className="flex gap-3 mb-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-gradient-to-br from-[#4a3aad] to-[#2b2b3d] flex items-center justify-center">
                            <span className="text-white text-xs font-black">K</span>
                        </div>
                        <div>
                            <p className="text-[12px] font-bold text-[#2b2b3d] mb-1">Welcome to Kayv OS v1.0</p>
                            <p className="text-[11px] text-[#4a4a4a] leading-relaxed">
                                This is my interactive portfolio. Click the desktop icons or use the taskbar to explore.
                            </p>
                        </div>
                    </div>

                    <div className="text-[10px] text-[#5a5a5a] space-y-1 mb-4 pl-11">
                        <p>
                            <span className="cursor-pointer text-[#4a3aad] underline hover:text-[#2b2b3d]" onClick={() => handleOpen('Home')}>About Me</span> — Learn who I am
                        </p>
                        <p>
                            <span className="cursor-pointer text-[#4a3aad] underline hover:text-[#2b2b3d]" onClick={() => handleOpen('Projects')}>Projects</span> — See what I've built
                        </p>
                        <p>
                            <span className="cursor-pointer text-[#4a3aad] underline hover:text-[#2b2b3d]" onClick={() => handleOpen('Send-Message')}>Terminal</span> — Try typing <code className="bg-[#e8e0d4] px-1 rounded-sm">neofetch</code>
                        </p>
                    </div>

                    {/* OK button */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleOK}
                            className="px-6 py-1 text-[11px] font-bold text-[#2b2b3d] cursor-pointer hover:brightness-105 active:brightness-95 uppercase tracking-wide"
                            style={{
                                background: 'linear-gradient(180deg, #d0c8b8, #b0a898)',
                                border: '2px solid #7a7060',
                                borderTopColor: '#e0d8c8',
                                borderLeftColor: '#e0d8c8',
                                borderRadius: '3px',
                            }}
                        >
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
