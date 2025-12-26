import React, { useContext } from 'react'
import MenuIcon from '../common/MenuIcon'
import { MenuContext } from '../utils/MenuContext'
import DockSearch from './DockSearch'
import { Mail, Download } from 'lucide-react'

const MenuBar = ({ onMenuClick }) => {
    const { openWindows, openWindow } = useContext(MenuContext)

    const handleMenuClick = (name) => {
        openWindow(name)
        onMenuClick(name);
    }


    const handleHireClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const email = 'khaingwutyiwin1712@gmail.com';
        const subject = 'Hire Request - Frontend Developer';
        const body = `Hello Khaing Wut Yi Win,

I am interested in discussing a potential opportunity with you. 

Project Details:
- Project Type: 
- Timeline: 
- Budget: 

Please let me know your availability and we can schedule a call to discuss further.

Best regards,
[Your Name]`;

        // Create Gmail compose URL that opens in a new tab
        const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Open Gmail compose in a new tab
        window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');
    };

    const handleResumeDownload = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const resumeUrl = '/KhaingWutYiWinResume.pdf';

        const link = document.createElement('a');
        link.href = resumeUrl;
        link.download = 'KhaingWutYiWinResume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className='fixed bottom-2 sm:bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[calc(100%-16px)] sm:w-auto max-w-[95vw] sm:max-w-[90vw] md:max-w-[95vw] lg:max-w-none px-0'>
            <div className='bg-[#fff8e7]/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(212,175,55,0.1),inset_0_1px_0_rgba(255,255,255,0.6)] border-[1.5px] border-black/20 rounded-xl sm:rounded-2xl md:rounded-3xl px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-2.5 md:py-3 lg:py-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2 md:gap-3 lg:gap-5 font-sans'>
                {/* Search Bar - Always visible, responsive sizing */}
                <div className="w-full sm:w-auto flex-shrink sm:flex-shrink-0 order-1 sm:order-1">
                    <div className="w-full sm:w-auto">
                        <DockSearch />
                    </div>
                </div>

                {/* Divider - Responsive */}
                <div className="hidden sm:block h-8 md:h-10 w-[1.5px] bg-gradient-to-b from-transparent via-black/20 to-transparent flex-shrink-0 order-2"></div>

                {/* Dock Icons - Responsive */}
                <div className="flex gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 items-center justify-center sm:justify-start flex-shrink-0 order-3 sm:order-3 overflow-x-auto scrollbar-hide">
                    <MenuIcon
                        icon="icons/home.svg"
                        menuName="Home"
                        isActive={openWindows.includes('Home')}
                        onClick={() => handleMenuClick('Home')}
                    />
                    <MenuIcon
                        icon="icons/openFolder.svg"
                        menuName="Projects"
                        isActive={openWindows.includes('Projects')}
                        onClick={() => handleMenuClick('Projects')}
                    />
                    <MenuIcon
                        icon="icons/gallery.svg"
                        menuName="Gallery"
                        isActive={openWindows.includes('Gallery')}
                        onClick={() => handleMenuClick('Gallery')}
                    />
                    <MenuIcon
                        icon="icons/terminal.svg"
                        menuName="OS-Terminal"
                        isActive={openWindows.includes('Send-Message')}
                        onClick={() => handleMenuClick('Send-Message')}
                    />
                    <MenuIcon
                        icon="icons/settings.svg"
                        menuName="Settings"
                        isActive={openWindows.includes('Settings')}
                        onClick={() => handleMenuClick('Settings')}
                    />
                </div>

                {/* Divider - Responsive */}
                <div className="hidden sm:block h-8 md:h-10 w-[1.5px] bg-gradient-to-b from-transparent via-black/20 to-transparent flex-shrink-0 order-4"></div>

                {/* Action Buttons - Responsive */}
                <div className="flex gap-1.5 sm:gap-2 items-center justify-center sm:justify-start flex-shrink-0 order-5 sm:order-5">
                    {/* Download Resume Button */}
                    <button
                        type="button"
                        onClick={handleResumeDownload}
                        className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-3.5 lg:px-4 py-1.5 sm:py-2 md:py-2.5 bg-gradient-to-br from-[#d4af37] to-[#b8941f] hover:from-[#b8941f] hover:to-[#d4af37] rounded-lg sm:rounded-xl border-[1.5px] border-[#d4af37]/50 shadow-[0_4px_12px_rgba(212,175,55,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_6px_16px_rgba(212,175,55,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] transition-all duration-300 transform hover:scale-105 active:scale-95 group whitespace-nowrap"
                    >
                        <Download size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] text-[#2d1b4e] group-hover:animate-bounce flex-shrink-0" />
                        <span className="text-[10px] sm:text-[11px] md:text-xs text-[#2d1b4e] font-bold tracking-wider uppercase whitespace-nowrap">Resume</span>
                    </button>

                    {/* Hire Me Button */}
                    <button
                        type="button"
                        onClick={handleHireClick}
                        className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-3.5 lg:px-4 py-1.5 sm:py-2 md:py-2.5 bg-gradient-to-br from-[#2d1b4e] to-[#6b5b95] hover:from-[#6b5b95] hover:to-[#2d1b4e] rounded-lg sm:rounded-xl border-[1.5px] border-[#d4af37]/30 shadow-[0_4px_12px_rgba(45,27,78,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_16px_rgba(45,27,78,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 transform hover:scale-105 active:scale-95 group whitespace-nowrap"
                    >
                        <Mail size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] text-[#d4af37] group-hover:animate-pulse flex-shrink-0" />
                        <span className="text-[10px] sm:text-[11px] md:text-xs text-white font-bold tracking-wider uppercase whitespace-nowrap">Hire Me</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MenuBar