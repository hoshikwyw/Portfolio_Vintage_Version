import React, { useContext } from 'react'
import { MenuContext } from '../../context/MenuContext'

const wallpapers = [
    { key: 'default', label: 'Classic', gradient: 'linear-gradient(180deg, #1e1e32, #2a2a3e, #3a3a52)' },
    { key: 'midnight', label: 'Midnight', gradient: 'linear-gradient(180deg, #08081a, #0e0e2a, #1a1a3e)' },
    { key: 'ocean', label: 'Ocean', gradient: 'linear-gradient(180deg, #081020, #0e1e35, #1a3050)' },
    { key: 'forest', label: 'Forest', gradient: 'linear-gradient(180deg, #081208, #0e1e0e, #1a301a)' },
    { key: 'rose', label: 'Rose', gradient: 'linear-gradient(180deg, #18101a, #2a1a22, #3a2a32)' },
    { key: 'ember', label: 'Ember', gradient: 'linear-gradient(180deg, #140e05, #2a1a08, #3a2a10)' },
]

const Settings = () => {
    const { wallpaper, setWallpaper } = useContext(MenuContext)

    return (
        <div className="w-full h-full overflow-y-auto p-4" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            <div className="max-w-md mx-auto">
                {/* Wallpaper Section */}
                <fieldset className="mb-4" style={{
                    border: '2px groove #c0b8a8',
                    borderRadius: '2px',
                    padding: '12px 14px',
                }}>
                    <legend className="text-[11px] font-bold text-[#2b2b3d] px-1 uppercase tracking-wide">Desktop Wallpaper</legend>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                        {wallpapers.map((wp) => (
                            <button
                                key={wp.key}
                                onClick={() => setWallpaper(wp.key)}
                                className="relative h-16 overflow-hidden cursor-pointer"
                                style={{
                                    background: wp.gradient,
                                    border: wallpaper === wp.key
                                        ? '2px solid #4a3aad'
                                        : '2px solid #8a8070',
                                    borderRadius: '2px',
                                    boxShadow: wallpaper === wp.key
                                        ? '0 0 0 1px #4a3aad, inset 0 0 0 1px rgba(106,90,205,0.3)'
                                        : 'inset 1px 1px 0 rgba(255,255,255,0.1)',
                                }}
                            >
                                <div className="absolute inset-0 flex items-end justify-center pb-1">
                                    <span className="text-[8px] text-white/80 font-bold uppercase tracking-wider" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                                        {wp.label}
                                    </span>
                                </div>
                                {wallpaper === wp.key && (
                                    <div className="absolute top-1 right-1 w-3 h-3 bg-[#4a3aad] rounded-sm flex items-center justify-center">
                                        <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </fieldset>

                {/* About Section */}
                <fieldset style={{
                    border: '2px groove #c0b8a8',
                    borderRadius: '2px',
                    padding: '12px 14px',
                }}>
                    <legend className="text-[11px] font-bold text-[#2b2b3d] px-1 uppercase tracking-wide">About This System</legend>
                    <div className="space-y-1.5 text-[11px] text-[#2b2b3d] mt-1">
                        <div className="flex justify-between">
                            <span>System</span>
                            <span className="font-bold">Kayv OS</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Version</span>
                            <span className="font-bold">1.0.0</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Built with</span>
                            <span className="font-bold">React + Vite + Tailwind</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Developer</span>
                            <span className="font-bold">Khaing Wut Yi Win</span>
                        </div>
                    </div>
                </fieldset>
            </div>
        </div>
    )
}

export default Settings
