import React, { useContext } from 'react'
import { MenuContext } from '../../context/MenuContext'

const wallpapers = [
    { key: 'default', label: 'Royal Purple', gradient: 'linear-gradient(135deg, #1a0e35, #2d1b4e, #4a2c6b, #6b5b95, #8b7ba8)' },
    { key: 'midnight', label: 'Midnight Gold', gradient: 'linear-gradient(135deg, #0a0a1a, #1a1a3e, #2d1b4e, #3d2b5e, #d4af37)' },
    { key: 'ocean', label: 'Deep Ocean', gradient: 'linear-gradient(135deg, #0c1445, #1a3a6b, #2d5f95, #6b9bc0)' },
    { key: 'forest', label: 'Forest Night', gradient: 'linear-gradient(135deg, #0a1f0a, #1a3d1a, #2d5f2d, #8fb88f)' },
    { key: 'rose', label: 'Vintage Rose', gradient: 'linear-gradient(135deg, #2d1b2d, #6b3a5b, #8b4a6b, #d4a5a5)' },
    { key: 'ember', label: 'Golden Ember', gradient: 'linear-gradient(135deg, #1a0a00, #3d1a00, #6b3a1a, #d4af37, #f4e4a6)' },
]

const Settings = () => {
    const { wallpaper, setWallpaper } = useContext(MenuContext)

    return (
        <div className="w-full h-full overflow-y-auto" style={{ padding: '24px' }}>
            <div className="max-w-lg mx-auto font-mono">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8 border-b-2 border-[#000000] pb-4">
                    <svg className="w-6 h-6 text-[#5768ad]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h2 className="text-xl font-bold text-[#45473a] uppercase tracking-wider">System Settings</h2>
                </div>

                {/* Wallpaper Section */}
                <div className="bg-white/95 rounded-sm border-2 border-[#000000] shadow-lg p-6 mb-6">
                    <h3 className="font-bold text-sm text-[#45473a] uppercase tracking-wider mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#5768ad]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Wallpaper
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        {wallpapers.map((wp) => (
                            <button
                                key={wp.key}
                                onClick={() => setWallpaper(wp.key)}
                                className={`relative h-20 rounded-xl border-2 transition-all duration-300 overflow-hidden group ${
                                    wallpaper === wp.key
                                        ? 'border-[#d4af37] shadow-[0_0_0_3px_rgba(212,175,55,0.3)] scale-[1.02]'
                                        : 'border-black/10 hover:border-[#d4af37]/50 hover:scale-[1.02]'
                                }`}
                                style={{ background: wp.gradient }}
                            >
                                <div className="absolute inset-0 flex items-end justify-center pb-1.5">
                                    <span className="text-[9px] text-white font-bold uppercase tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                                        {wp.label}
                                    </span>
                                </div>
                                {wallpaper === wp.key && (
                                    <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#d4af37] rounded-full flex items-center justify-center">
                                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* About Section */}
                <div className="bg-white/95 rounded-sm border-2 border-[#000000] shadow-lg p-6">
                    <h3 className="font-bold text-sm text-[#45473a] uppercase tracking-wider mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#5768ad]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        About This System
                    </h3>
                    <div className="space-y-2 text-sm text-[#45473a]">
                        <div className="flex justify-between">
                            <span className="font-semibold">System</span>
                            <span className="text-[#5768ad] font-bold">vintage Oro OS</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Version</span>
                            <span className="text-[#5768ad]">1.0.0</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Built with</span>
                            <span className="text-[#5768ad]">React + Vite + Tailwind</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Developer</span>
                            <span className="text-[#5768ad]">Khaing Wut Yi Win</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings
