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
        <div className=' bg-light-white/40 searchBarPadding'>
            <form
                onSubmit={handleSubmit}
                className=""
            >
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What you wanna search ? ....."
                    className="flex-1 bg-transparent outline-none placeholder-white/70 text-sm text-white"
                />
                <button
                    type="submit"
                    className="p-1 hover:scale-110 transition"
                    aria-label="Search Google"
                >
                    <MagnifyingGlassIcon className="h-4 w-4 text-white" />
                </button>
            </form>

        </div>
    );
}
