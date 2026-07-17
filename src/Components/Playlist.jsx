import React from "react";
import Tracklist from "./Tracklist";

function Playlist() {

    return (
        <div className="playlist-container">
            <h2>Playlist</h2>
            <Tracklist tracks={[]} />
            <button className="search-button">SAVE TO SPOTIFY</button>
        </div>
    );

}

export default Playlist;