import React, { useState } from 'react';

function SearchBar(props) {
    const [term, setTerm] = useState('');

    const handleTermChange = (event) => {
        setTerm(event.target.value);
    };

    const handleSearch = () => {
        if (props.onSearch) {
            props.onSearch(term);
        }
    };

    return (
    <div className='search-container'>
        <input 
        className="search-input"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder='Enter A Song, Artist, or Album'
        />
        <button
        type="button"
        className='search-button'
        onClick={handleSearch}
        >SEARCH</button>
    </div>
    );
}

export default SearchBar;