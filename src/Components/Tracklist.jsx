import React from "react";
import Track from "./Track";

function Tracklist(props) {

    return (
        <div>
            <h2>Tracklist</h2>
            {props.tracks.map((track) => {
                return (
                <Track
                key={track.id}
                track={track}
                />
                );
            })}

        </div>
    );

}

export default Tracklist;