import { useState } from 'react'
import { FONT_STACK } from '@/constants/ui'

const notes = [
  'Currently exploring Three.js & WebGL',
  'Learning Rust on weekends',
  'Open to freelance work!',
  'This whole site is a fake OS btw',
  'Try right-clicking the desktop ;)',
  "Type 'neofetch' in the terminal!",
]

/** Dismissible desktop sticky note showing one random hint. */
export default function StickyNote() {
  const [noteIndex] = useState(() => Math.floor(Math.random() * notes.length))
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="absolute z-10 select-none" style={{ right: 24, top: 20, width: 180, transform: 'rotate(2deg)' }}>
      <div
        style={{
          background: '#f5e6a3',
          padding: '10px 12px 14px',
          boxShadow: '2px 3px 8px rgba(0,0,0,0.25), inset 0 -2px 4px rgba(0,0,0,0.05)',
          borderRadius: '1px',
          position: 'relative',
          fontFamily: FONT_STACK,
        }}
      >
        {/* Tape effect */}
        <div
          style={{
            position: 'absolute',
            top: -6,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 50,
            height: 12,
            background: 'rgba(200,190,170,0.6)',
            borderRadius: '1px',
          }}
        />

        {/* Close */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-1 right-1.5 text-[10px] text-[#8a7a4a] hover:text-[#4a3a2a] cursor-pointer leading-none"
          style={{ background: 'none', border: 'none' }}
        >
          ×
        </button>

        <p className="text-[11px] text-[#4a3a1a] leading-relaxed font-medium mt-1">{notes[noteIndex]}</p>

        <div className="mt-2 text-right">
          <span className="text-[9px] text-[#8a7a4a] italic">— Kayv</span>
        </div>
      </div>
    </div>
  )
}
