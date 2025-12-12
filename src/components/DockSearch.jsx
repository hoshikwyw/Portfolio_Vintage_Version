// DockSearch.jsx
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"; // optional icon

export default function DockSearch() {
    const [query, setQuery] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) return;             // ignore empty
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        window.open(url, "_blank", "noopener,noreferrer"); // new tab
        setQuery("");                          // clear field after launch
    };

    return (
        <div className='bg-white/70 backdrop-blur-md border-[1.5px] border-black/15 rounded-2xl px-4 py-2 min-w-[240px] hover:bg-white/80 transition-all duration-300 focus-within:border-[#d4af37] focus-within:shadow-[0_0_0_3px_rgba(212,175,55,0.15),0_2px_8px_rgba(212,175,55,0.2)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.05),0_1px_2px_rgba(212,175,55,0.1)]'>
            <form
                onSubmit={handleSubmit}
                className="flex items-center gap-3"
            >
                <MagnifyingGlassIcon className="h-4 w-4 text-[#2d1b4e] flex-shrink-0 opacity-70" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    className="flex-1 bg-transparent outline-none placeholder-black/40 text-sm text-[#2d1b4e] py-0.5 placeholder:text-xs font-sans"
                />
                {query && (
                    <button
                        type="submit"
                        className="p-1 hover:scale-110 transition-transform opacity-60 hover:opacity-100 rounded-md hover:bg-[#d4af37]/20"
                        aria-label="Search Google"
                    >
                        <svg className="h-3.5 w-3.5 text-[#2d1b4e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                )}
            </form>
        </div>
    );
}
