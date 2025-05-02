import React from 'react'

const SearchBar = () => {
    const [searchText, setSearchText] = React.useState('')
    return (
        <div className=' bg-light-white/40 searchBarPadding'>
            <div className="flex justify-between items-center">
                <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder='What you wanna search ?' className="all-unset outline-none font-bold text-[20px] text-white inputPadding" />
                <button className=' w-12 h-12' type='button' onClick={() => console.log('Search button clicked', searchText)}>
                    <img src="icons/search.svg" alt="Search Icon" />
                </button>
            </div>
        </div>
    )
}

export default SearchBar