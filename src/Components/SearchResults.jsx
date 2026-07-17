import React from "react";
import Tracklist from "./Tracklist";

function SearchResults(props) {

    return (

        <div className="results-container">
            <h2>Results</h2>
            <Tracklist tracks={props.searchResults} />
        </div>


    );
}

export default SearchResults;