import { Phone } from "lucide-react";

const skills = [
    { name: "React.js", level: "90%" },
    { name: "Tailwind CSS", level: "85%" },
    { name: "Next.js", level: "75%" },
    { name: "JavaScript", level: "90%" },
    { name: "TypeScript", level: "70%" },
];

const HomeWindow = () => {
    const s = {
        fieldset: { border: 'var(--os-fieldset-border)', borderRadius: 'var(--os-btn-radius)', padding: '12px' },
        legend: { fontSize: 10, fontWeight: 700, color: 'var(--os-text)', paddingInline: 4, textTransform: 'uppercase', letterSpacing: '0.05em' },
        text: { color: 'var(--os-text)' },
        sub: { color: 'var(--os-accent)' },
        muted: { color: 'var(--os-text-secondary)' },
        input: { border: 'var(--os-input-border)', background: 'var(--os-input-bg)' },
        tag: { border: '1px solid var(--os-border-dark)', background: 'var(--os-panel-bg)', borderRadius: 'var(--os-btn-radius)' },
        dot: { width: 8, height: 8, borderRadius: '50%', background: 'var(--os-accent)', flexShrink: 0 },
    }

    return (
        <div className="min-h-screen p-4" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="lg:w-1/3 flex flex-col gap-4">
                        <fieldset style={s.fieldset}>
                            <legend style={s.legend}>Profile</legend>
                            <div className="flex items-center flex-col">
                                <div className="w-[120px] h-[120px] mb-3 overflow-hidden" style={s.input}>
                                    <img src="/myPf.png" alt="Kayv" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                                </div>
                                <h1 className="text-xl font-bold tracking-wider uppercase text-center" style={s.text}>Khaing Wut Yi Win</h1>
                                <p className="font-bold uppercase text-xs mt-1 tracking-wider" style={s.sub}>Frontend Developer</p>
                                <p className="text-[10px] mt-1 tracking-widest font-semibold" style={s.muted}>YANGON, MYANMAR</p>
                            </div>
                        </fieldset>
                        <fieldset style={s.fieldset}>
                            <legend style={s.legend}>About</legend>
                            <p className="text-[12px] leading-relaxed" style={s.text}>
                                "Hi! I'm Kayv — a creative frontend developer who loves crafting smooth UIs with React and Tailwind. I'm always excited to learn something new."
                            </p>
                        </fieldset>
                        <fieldset style={s.fieldset}>
                            <legend style={s.legend}>Contact</legend>
                            <div className="space-y-2">
                                <p className="flex items-center gap-2 text-[11px]" style={s.text}>
                                    <svg className="w-3.5 h-3.5" style={{ color: 'var(--os-accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    khaingwutyiwin1712@gmail.com
                                </p>
                                <p className="flex items-center gap-2 text-[11px]" style={s.text}>
                                    <Phone className="w-3.5 h-3.5" style={{ color: 'var(--os-accent)' }} />
                                    +959795847089
                                </p>
                            </div>
                        </fieldset>
                    </div>
                    <div className="lg:w-2/3 flex flex-col gap-4">
                        {[
                            { title: 'Education', items: [{ h: 'Frontend Web Developer', p: 'MMS-IT' }, { h: 'Self-taught Frontend Development', p: 'React, Tailwind CSS, Next.js, React Native, Typescript' }] },
                            { title: 'Experience', items: [{ h: 'Junior Frontend Developer', p: 'IT-Wizard since 2024 November' }, { h: 'Freelance Projects', p: 'Portfolio, Booking App, AI Assistant UI' }] },
                        ].map(section => (
                            <fieldset key={section.title} style={s.fieldset}>
                                <legend style={s.legend}>{section.title}</legend>
                                <ul className="space-y-3">
                                    {section.items.map(item => (
                                        <li key={item.h} className="flex items-center gap-3">
                                            <div style={s.dot} />
                                            <div>
                                                <h4 className="font-bold text-[12px]" style={s.text}>{item.h}</h4>
                                                <p className="text-[11px] font-semibold" style={s.sub}>{item.p}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </fieldset>
                        ))}
                        <fieldset style={s.fieldset}>
                            <legend style={s.legend}>Skills</legend>
                            <div className="flex flex-col gap-2.5">
                                {skills.map(skill => (
                                    <div key={skill.name}>
                                        <div className="flex justify-between mb-1">
                                            <span className="font-bold uppercase text-[11px] tracking-wide" style={s.text}>{skill.name}</span>
                                            <span className="font-bold text-[11px]" style={s.sub}>{skill.level}</span>
                                        </div>
                                        <div className="w-full h-3 overflow-hidden" style={s.input}>
                                            <div className="h-full" style={{ width: skill.level, background: 'var(--os-accent)' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </fieldset>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <fieldset style={s.fieldset}>
                                <legend style={s.legend}>Languages</legend>
                                <div className="space-y-1.5">
                                    {['English — Intermediate', 'Burmese — Native'].map(l => (
                                        <div key={l} className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--os-accent)' }} />
                                            <span className="text-[11px]" style={s.text}>{l}</span>
                                        </div>
                                    ))}
                                </div>
                            </fieldset>
                            <fieldset style={s.fieldset}>
                                <legend style={s.legend}>Interests</legend>
                                <div className="flex flex-wrap gap-1.5">
                                    {["Design", "Animation", "AI", "Vintage UI", "2D Games"].map(i => (
                                        <span key={i} className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5" style={{ ...s.tag, color: 'var(--os-text)' }}>{i}</span>
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
