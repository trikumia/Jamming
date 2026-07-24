import React from "react";
import Tracklist from "../Tracklist/Tracklist";
import  "./searchresults.css";

function SearchResults(props) {
    return (
        <div className="results-container">
            <h2>Results</h2>
            <Tracklist tracks={props.searchResults} onAdd={props.onAdd} />
        </div>
    );
}

export default SearchResults;