import React from "react";
import Track from "./Track";

function Tracklist(props) {
    return (
        <div>
            {props.tracks?.map((track) => (
                <Track
                key={track.id}
                track={track}
                isRemoval={props.isRemoval}
                onAdd={props.onAdd}
                onRemove={props.onRemove}
                />
            ))}
        </div>
    );

}

export default Tracklist;