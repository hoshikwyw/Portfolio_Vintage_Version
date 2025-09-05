const skills = [
    { name: "React.js", level: "90%" },
    { name: "Tailwind CSS", level: "85%" },
    { name: "Next.js", level: "75%" },
    { name: "JavaScript", level: "90%" },
    { name: "TypeScript", level: "70%" },
];

const HomeWindow = () => {
    return (
        <div style={{ padding: "10px" }} className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 ">
            <div style={{ margin: "10px" }} className="max-w-7xl mx-auto">
                {/* Main Container */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* LEFT COLUMN - PROFILE SECTION */}
                    <div className="lg:w-1/3 space-y-6 flex flex-col gap-6">
                        {/* Profile Card */}
                        <div style={{ padding: "10px" }} className="bg-white/80 backdrop-blur-md p-6 flex items-center flex-col rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="relative overflow-hidden w-[150px] h-[150px] rounded-lg aspect-square mb-4">
                                <img
                                    src="/myPf.png"
                                    alt="Oro avatar"
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                            <div className="text-center">
                                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                                    ORO
                                </h1>
                                <p className="text-gray-700 font-medium uppercase text-sm mt-1">
                                    Frontend Developer
                                </p>
                                <p className="text-xs text-gray-600 mt-2 tracking-wider">
                                    YANGON, MYANMAR
                                </p>
                            </div>
                        </div>

                        {/* Bio Card */}
                        <div style={{ padding: "10px" }} className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 p-4">
                            <p className="text-gray-700 leading-relaxed italic">
                                "Hi! I'm Oro — a creative frontend developer who loves crafting
                                smooth UIs with React and Tailwind. I'm always excited to learn
                                something new that helps me grow professionally."
                            </p>
                        </div>

                        {/* Contact Card */}
                        <div style={{ padding: "10px" }} className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 p-6 space-y-3 flex flex-col gap-2">
                            <p className="font-bold text-lg text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                                <svg
                                    className="w-5 h-5 text-indigo-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    />
                                </svg>
                                CONTACT
                            </p>
                            <div className="space-y-2 pl-7 flex flex-col gap-2">
                                <p className="text-gray-700 flex items-center gap-2 text-sm">
                                    <svg
                                        className="w-4 h-4 text-gray-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    orodev@gmail.com
                                </p>
                                <p className="text-gray-700 flex items-center gap-2 text-sm">
                                    <svg
                                        className="w-4 h-4 text-gray-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                        />
                                    </svg>
                                    @oro.codes
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - DETAILS SECTION */}
                    <div className="lg:w-2/3 space-y-8 flex flex-col gap-6">
                        {/* Education Section */}
                        <div style={{ padding: "10px" }} className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 p-6 space-y-3">
                            <h3 className="font-bold text-xl mb-6 text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                                <svg
                                    className="w-6 h-6 text-indigo-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                                EDUCATION
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-4">
                                    <div className="flex-shrink-0 mt-3">
                                        <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            Computer Science
                                        </h4>
                                        <p className="text-gray-600 text-sm">YUFL (2017 - 2021)</p>
                                    </div>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            Self-taught Frontend Development
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            React, Tailwind CSS, Next.js
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Experience Section */}
                        <div style={{ padding: '10px' }} className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 p-6 space-y-3">
                            <h3 className="font-bold text-xl mb-6 text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                                <svg
                                    className="w-6 h-6 text-indigo-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                                EXPERIENCE
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            Junior Frontend Developer
                                        </h4>
                                        <p className="text-gray-600 text-sm">@ LiiT Brand</p>
                                    </div>
                                </li>
                                <li className="flex items-center gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            Freelance Projects
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            Portfolio, Booking App, AI Assistant UI
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Skills Section */}
                        <div style={{ padding: '10px' }} className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 p-6 space-y-3">
                            <h3 style={{ paddingBottom: '2px' }} className="font-bold text-xl mb-6 text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                                <svg
                                    className="w-6 h-6 text-indigo-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                    />
                                </svg>
                                SKILLS
                            </h3>
                            <div style={{ padding: '10px' }} className=" flex flex-col gap-3">
                                {skills.map((skill) => (
                                    <div key={skill.name} className="mb-3">
                                        <div className="flex justify-between mb-2">
                                            <span className="font-medium text-gray-900">
                                                {skill.name}
                                            </span>
                                            <span className="text-gray-600">{skill.level}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-2.5 rounded-full"
                                                style={{ width: skill.level }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Languages & Interests */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Languages Card */}
                            <div style={{ padding: '10px' }} className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 space-y-3">
                                <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                                    <svg
                                        className="w-5 h-5 text-indigo-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                                        />
                                    </svg>
                                    LANGUAGES
                                </h3>
                                <div style={{ padding: '4px' }} className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full flex-shrink-0"></span>
                                        <span className="text-gray-700 text-sm">
                                            English — Intermediate
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full flex-shrink-0"></span>
                                        <span className="text-gray-700 text-sm">
                                            Burmese — Native
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Interests Card */}
                            <div style={{ padding: '10px' }} className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 space-y-3">
                                <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2 border-b border-gray-200 pb-2">
                                    <svg
                                        className="w-5 h-5 text-indigo-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                    INTERESTS
                                </h3>
                                <div style={{ padding: '10px' }} className="flex flex-wrap gap-2 pl-7">
                                    {[
                                        "Design",
                                        "Animation",
                                        "AI",
                                        "Vintage UI",
                                        "2D Games",
                                    ].map((interest) => (
                                        <span
                                            style={{ padding: '3px 5px' }}
                                            key={interest}
                                            className="bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium border border-indigo-200"
                                        >
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeWindow;
