import { Mail, Download } from 'lucide-react'

export default function QuickActions() {
    const handleResume = () => {
        const a = document.createElement('a')
        a.href = '/KhaingWutYiWinResume.pdf'
        a.download = 'KhaingWutYiWinResume.pdf'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    const handleHire = () => {
        const email = 'khaingwutyiwin1712@gmail.com'
        const subject = 'Hire Request - Frontend Developer'
        const body = 'Hello Khaing Wut Yi Win,\n\nI am interested in discussing a potential opportunity.\n\nBest regards,'
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank', 'noopener')
    }

    return (
        <div className="absolute bottom-14 right-4 z-10 flex flex-col gap-1.5">
            <button
                onClick={handleResume}
                className="quick-action-btn group"
                title="Download Resume"
            >
                <Download size={14} className="flex-shrink-0" />
                <span>Resume</span>
            </button>
            <button
                onClick={handleHire}
                className="quick-action-btn quick-action-primary group"
                title="Hire Me"
            >
                <Mail size={14} className="flex-shrink-0" />
                <span>Hire Me</span>
            </button>
        </div>
    )
}
