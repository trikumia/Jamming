import React from "react";

function Track(props) {
    const handleAddClick = () => {
        if (props.onAdd) {
            props.onAdd(props.track);
        }
    };

    const handleRemoveClick = () => {
        if (props.onRemove) {
            props.onRemove(props.track);
        }
    }

    return (
        <div className="track-container">
            <div className="track">
                <h3>Track</h3>
                <p>Name: {props.track.name}</p>
                <p>Artist: {props.track.artist} </p>
                <p>Album: {props.track.album} </p>


        {props.onAdd && (
        <button className="add-button" onClick={handleAddClick} type ="button">
            +
        </button>
        )}

        {props.isRemoval && (
            <button className="add-button" onClick={handleRemoveClick} type ="button"> 
        -
        </button>
        )}
                  </div>
    </div>
    );
}

export default Track;