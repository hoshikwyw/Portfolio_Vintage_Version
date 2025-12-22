import React from 'react';
import { Mail } from 'lucide-react';

const HireButton = () => {
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

    return (
        <button
            type="button"
            onClick={handleHireClick}
            className="w-full h-full flex flex-col items-center justify-center "
            style={{ padding: "20px", zIndex: 10001, position: 'relative', pointerEvents: 'auto' }}
        >
            <div className="flex flex-col items-center gap-3">
                <div className="bg-gradient-to-br from-[#d4af37] to-[#b8941f] p-4 rounded-full shadow-[0_4px_12px_rgba(212,175,55,0.3)] group-hover:shadow-[0_6px_16px_rgba(212,175,55,0.4)] transition-all duration-300">
                    <Mail size={22} className="text-[#2d1b4e]" />
                </div>
                {/* <div className="text-center">
                    <span className="text-lg md:text-xl font-bold uppercase tracking-wider text-[#2d1b4e] group-hover:text-[#5768ad] transition-colors duration-300">
                        HIRE ME
                    </span>
                    <p className="text-xs text-[#6b5b95] font-semibold mt-1 uppercase tracking-wide">
                        Quick Contact
                    </p>
                </div> */}
            </div>
        </button>
    );
};

export default HireButton;

