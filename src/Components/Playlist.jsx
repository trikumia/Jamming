import React from "react";
import Tracklist from "./Tracklist";

function Playlist(props) {

    const handleNameChange = (event) => {
        props.setPlaylistName(event.target.value);
    };

    return (
        <div className="playlist-container">
            <h2>Playlist</h2>

            <input 
            className="playlist-name-input"
            value={props.playlistName}
            onChange={handleNameChange}
            />

            <Tracklist
            tracks={props.playlistTracks}
            isRemoval={true}
            onRemove={props.onRemove}
            />

            <div className="search-container">
                <button className="search-button" onClick={props.onSave}>SAVE TO SPOTIFY</button>     
            </div> 
        </div>
    );

}

export default Playlist;