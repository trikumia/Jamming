import React from "react";

function Track(props) {

    return (
    <div>
        <h3>Track</h3>
        <p>Name: {props.track.name}</p>
        <p>Artist: {props.track.artist} </p>
        <p>Album: {props.track.album} </p>

    </div>
    );

}

export default Track;