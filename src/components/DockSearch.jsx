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
        <div className='bg-[#dfdde0] border-2 border-[#000000] rounded-sm px-3 py-2 min-w-[240px] hover:bg-[#dad9e1] transition-colors duration-200'>
            <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2.5"
            >
                <MagnifyingGlassIcon className="h-4 w-4 text-[#45473a] flex-shrink-0" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    className="flex-1 bg-transparent outline-none placeholder-[#a9a9ab] text-sm text-[#45473a] py-0.5 placeholder:text-xs font-mono"
                />
                {query && (
                    <button
                        type="submit"
                        className="p-1 hover:scale-110 transition-transform opacity-60 hover:opacity-100"
                        aria-label="Search Google"
                    >
                        <svg className="h-3.5 w-3.5 text-[#45473a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                )}
            </form>
        </div>
    );
}
