import React from 'react'

const SearchBar = () => {
    const [searchText, setSearchText] = React.useState('')
    return (
        <div className=' bg-light-white/40 searchBarPadding'>
            <div className="flex justify-between items-center">
                <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder='What you wanna search ?' className="all-unset outline-none font-bold text-[11px] text-white inputPadding w-full" />
                <button className=' w-5 h-5 cursor-pointer' type='button' onClick={() => console.log('Search button clicked', searchText)}>
                    <img src="icons/search.svg" alt="Search Icon" />
                </button>
            </div>
        </div>
    )
}

export default SearchBar