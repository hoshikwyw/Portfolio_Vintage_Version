import { Phone } from "lucide-react";

const skills = [
    { name: "React.js", level: "90%" },
    { name: "Tailwind CSS", level: "85%" },
    { name: "Next.js", level: "75%" },
    { name: "JavaScript", level: "90%" },
    { name: "TypeScript", level: "70%" },
];

const HomeWindow = () => {
    return (
        <div className="min-h-screen p-4" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* LEFT COLUMN */}
                    <div className="lg:w-1/3 flex flex-col gap-4">
                        {/* Profile Card */}
                        <fieldset style={{ border: '2px groove #c0b8a8', borderRadius: '2px', padding: '12px' }}>
                            <legend className="text-[10px] font-bold text-[#2b2b3d] px-1 uppercase tracking-wide">Profile</legend>
                            <div className="flex items-center flex-col">
                                <div className="w-[120px] h-[120px] mb-3 overflow-hidden" style={{ border: '2px inset #a0a090' }}>
                                    <img
                                        src="/myPf.png"
                                        alt="Kayv avatar"
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                    />
                                </div>
                                <h1 className="text-xl font-bold text-[#2b2b3d] tracking-wider uppercase text-center">
                                    Khaing Wut Yi Win
                                </h1>
                                <p className="text-[#4a3aad] font-bold uppercase text-xs mt-1 tracking-wider">
                                    Frontend Developer
                                </p>
                                <p className="text-[10px] text-[#5a5a5a] mt-1 tracking-widest font-semibold">
                                    YANGON, MYANMAR
                                </p>
                            </div>
                        </fieldset>

                        {/* Bio Card */}
                        <fieldset style={{ border: '2px groove #c0b8a8', borderRadius: '2px', padding: '12px' }}>
                            <legend className="text-[10px] font-bold text-[#2b2b3d] px-1 uppercase tracking-wide">About</legend>
                            <p className="text-[#3a3a3a] text-[12px] leading-relaxed">
                                "Hi! I'm Kayv — a creative frontend developer who loves crafting
                                smooth UIs with React and Tailwind. I'm always excited to learn
                                something new that helps me grow professionally."
                            </p>
                        </fieldset>

                        {/* Contact Card */}
                        <fieldset style={{ border: '2px groove #c0b8a8', borderRadius: '2px', padding: '12px' }}>
                            <legend className="text-[10px] font-bold text-[#2b2b3d] px-1 uppercase tracking-wide">Contact</legend>
                            <div className="space-y-2">
                                <p className="text-[#3a3a3a] flex items-center gap-2 text-[11px]">
                                    <svg className="w-3.5 h-3.5 text-[#4a3aad]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    khaingwutyiwin1712@gmail.com
                                </p>
                                <p className="text-[#3a3a3a] flex items-center gap-2 text-[11px]">
                                    <Phone className="w-3.5 h-3.5 text-[#4a3aad]" />
                                    +959795847089
                                </p>
                            </div>
                        </fieldset>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:w-2/3 flex flex-col gap-4">
                        {/* Education */}
                        <fieldset style={{ border: '2px groove #c0b8a8', borderRadius: '2px', padding: '12px' }}>
                            <legend className="text-[10px] font-bold text-[#2b2b3d] px-1 uppercase tracking-wide">Education</legend>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-[#4a3aad] rounded-full flex-shrink-0"></div>
                                    <div>
                                        <h4 className="font-bold text-[12px] text-[#2b2b3d]">Frontend Web Developer</h4>
                                        <p className="text-[#4a3aad] text-[11px] font-semibold">MMS-IT</p>
                                    </div>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-[#4a3aad] rounded-full flex-shrink-0"></div>
                                    <div>
                                        <h4 className="font-bold text-[12px] text-[#2b2b3d]">Self-taught Frontend Development</h4>
                                        <p className="text-[#4a3aad] text-[11px] font-semibold">React, Tailwind CSS, Next.js, React Native, Typescript</p>
                                    </div>
                                </li>
                            </ul>
                        </fieldset>

                        {/* Experience */}
                        <fieldset style={{ border: '2px groove #c0b8a8', borderRadius: '2px', padding: '12px' }}>
                            <legend className="text-[10px] font-bold text-[#2b2b3d] px-1 uppercase tracking-wide">Experience</legend>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-[#4a3aad] rounded-full flex-shrink-0"></div>
                                    <div>
                                        <h4 className="font-bold text-[12px] text-[#2b2b3d]">Junior Frontend Developer</h4>
                                        <p className="text-[#4a3aad] text-[11px] font-semibold">IT-Wizard since 2024 November</p>
                                    </div>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-[#4a3aad] rounded-full flex-shrink-0"></div>
                                    <div>
                                        <h4 className="font-bold text-[12px] text-[#2b2b3d]">Freelance Projects</h4>
                                        <p className="text-[#4a3aad] text-[11px] font-semibold">Portfolio, Booking App, AI Assistant UI</p>
                                    </div>
                                </li>
                            </ul>
                        </fieldset>

                        {/* Skills */}
                        <fieldset style={{ border: '2px groove #c0b8a8', borderRadius: '2px', padding: '12px' }}>
                            <legend className="text-[10px] font-bold text-[#2b2b3d] px-1 uppercase tracking-wide">Skills</legend>
                            <div className="flex flex-col gap-2.5">
                                {skills.map((skill) => (
                                    <div key={skill.name}>
                                        <div className="flex justify-between mb-1">
                                            <span className="font-bold text-[#2b2b3d] uppercase text-[11px] tracking-wide">{skill.name}</span>
                                            <span className="text-[#4a3aad] font-bold text-[11px]">{skill.level}</span>
                                        </div>
                                        <div className="w-full h-3 overflow-hidden" style={{ border: '2px inset #a0a090', background: '#e8e0d4' }}>
                                            <div
                                                className="h-full bg-gradient-to-r from-[#4a3aad] to-[#6a5acd]"
                                                style={{ width: skill.level }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </fieldset>

                        {/* Languages & Interests */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <fieldset style={{ border: '2px groove #c0b8a8', borderRadius: '2px', padding: '12px' }}>
                                <legend className="text-[10px] font-bold text-[#2b2b3d] px-1 uppercase tracking-wide">Languages</legend>
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#4a3aad] rounded-full"></span>
                                        <span className="text-[#3a3a3a] text-[11px]">English — Intermediate</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-[#4a3aad] rounded-full"></span>
                                        <span className="text-[#3a3a3a] text-[11px]">Burmese — Native</span>
                                    </div>
                                </div>
                            </fieldset>

                            <fieldset style={{ border: '2px groove #c0b8a8', borderRadius: '2px', padding: '12px' }}>
                                <legend className="text-[10px] font-bold text-[#2b2b3d] px-1 uppercase tracking-wide">Interests</legend>
                                <div className="flex flex-wrap gap-1.5">
                                    {["Design", "Animation", "AI", "Vintage UI", "2D Games"].map((interest) => (
                                        <span
                                            key={interest}
                                            className="text-[10px] font-bold text-[#2b2b3d] uppercase tracking-wide px-2 py-0.5"
                                            style={{ border: '1px solid #a0a090', background: '#e8e0d4', borderRadius: '2px' }}
                                        >
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            </fieldset>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeWindow;
