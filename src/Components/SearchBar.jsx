import React from 'react';

function SearchBar() {

    return (
    <div className='search-bar-container'>
        <input className="search-input" placeholder='Enter A Song, Artist, or Album'/>
        <button className='search-button'>SEARCH</button>
    </div>
    );
}

export default SearchBar;