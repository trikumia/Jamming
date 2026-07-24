import React, {useState } from "react";
import SearchBar from "./Components/SearchBar";
import SearchResults from "./Components/SearchResults";
import Playlist from "./Components/Playlist";
import "./App.css";
import * as Spotify from "./Spotify";

function App() {
  const [playlistName, setPlaylistName] = useState('My Playlist');
  const [playlistTracks, setPlaylistTracks] = useState([
    {id:"3", name:"HourGlass", artist:"Lamb of God", album:"Ashes of the Wake", uri:"spotify:track:3"},
    {id:"4", name:"Dig Up Her Bones", artist:"Misfits", album:"American Psycho", uri:"spotify:track:4"},
    {id:"5", name:"Seek & Destroy", artist:"Metallica", album:"Kill 'Em All", uri:"spotify:track:5"}
  ]);

//create hardcoded search results state
  const [searchResults, setSearchResults] = useState([
    {id:"1", name:"Lipan Conjuring", artist:"Tool", album:"10,000 Days", uri:"spotify:track:1"},
    {id:"2", name:"Bleak", artist:"Opeth", album:"Blackwater Park", uri:"spotify:track:2"},
    {id:"3", name:"HourGlass", artist:"Lamb of God", album:"Ashes of the Wake", uri:"spotify:track:3"},
    {id:"4", name:"Dig Up Her Bones", artist:"Misfits", album:"American Psycho", uri:"spotify:track:4"},
    {id:"5", name:"Seek & Destroy", artist:"Metallica", album:"Kill 'Em All", uri:"spotify:track:5"},
    {id:"6", name:"Dog Days Are Over", artist:"Florence and the Machine", album:"Lungs", uri:"spotify:track:6"},
    {id:"7", name:"Monkey Business", artist:"Skid Row", album:"Slave To The Ground", uri:"spotify:track:7"},
    {id:"8", name:"Angry Chair", artist:"Alice in Chains", album:"Dirt", uri:"spotify:track:8"},
    {id:"9", name:"Fire Woman", artist:"The Cult", album:"Sonic Temple", uri:"spotify:track:9"},
    {id:"10", name:"Welcome to the Jungle", artist:"Guns n Roses", album:"Appetite for Destruction", uri:"spotify:track:10"}
  ]);

  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const searchTracks = async (searchTerm) => {
    const searchTermClean = (searchTerm || "").trim();

    if (!searchTermClean) {
      setErrorMessage("Please enter a song, artist, or album.");
      setShowErrorPopup(true);
      return;
    }
    setErrorMessage("");
    setShowErrorPopup(false);

    let token = null;

    try{
      token = await Spotify.getAccessToken();
    } catch (error) {
      console.error("Spotify auth error:", error);

      if (error.message.includes("expired") || error.message.includes("invalid_grant")) {
        setSuccessMessage("");
        setShowSuccessPopup(false);
        setErrorMessage("Spotify login expired. Please sign in again.");
        setShowErrorPopup(true)

        try {
          await Spotify.authorize();
        } catch (authError) {
          console.error("Authorize error:", authError);
          setErrorMessage("Could not start Spotify authorization.");
          setShowErrorPopup(true);
          }
          return;
        }

      setSuccessMessage("");
      setShowSuccessPopup(false);
      setErrorMessage(error.message || "Spotify authorization failed.");
      setShowErrorPopup(true);
      return;    
    }

    if (!token) {
    setErrorMessage("Spotify authorization is required to search.");
    setShowErrorPopup(true);
    try {
      await Spotify.authorize();
    } catch (authError){
      console.error("Authorize error:", authError);
      setErrorMessage("Could not start Spotify authorization.");
      setShowErrorPopup(true);      
    }
    return;
  }

    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTermClean)}&type=track`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

    if (!response.ok) {
      throw new Error("Search request failed"); 
    };

    const data = await response.json();
    const tracks = data.tracks.items.map((track) => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      uri: track.uri
    }));

    setSearchResults(tracks);
  } catch (error) {
    console.error("Search Error:", error.message);
    setErrorMessage(error.message || "Search failed.");
    setShowErrorPopup(true);
  }
  };

  const addTrack = (track) => {
    setPlaylistTracks((prevTracks) => {
      const trackExists = prevTracks.some((existingTrack) =>
      existingTrack.id === track.id );
      if (trackExists) {
        return prevTracks;
      }
      return [...prevTracks, track];
    });
  };

  const removeTrack = (track) => {
    setPlaylistTracks((prevTracks) => 
      prevTracks.filter((savedTrack) => savedTrack.id !== track.id)
    );
  };

  const savePlaylist = async () => {
    const trimmedPlaylistName = (playlistName || "").trim();
    const hasTracks = playlistTracks.length > 0;

    if (!trimmedPlaylistName || !hasTracks) {
      setErrorMessage("Please enter a Playlist name and add at least one track before saving");
      setShowErrorPopup(true);
      return;
    }

    setErrorMessage("");
    setShowErrorPopup(false);
    setSuccessMessage("Saving playlist...");
    setShowSuccessPopup(false);

    let token = null;

    try {
      token = await Spotify.getAccessToken();
      } catch (error) {
        console.error("Spotify auth error:", error);

        if (error.message.includes("expired") || error.message.includes("invalid_grant")) {
          setSuccessMessage("");
          setShowSuccessPopup(false);
          setErrorMessage("Spotify login expired. Please sign in again.");
          setShowErrorPopup(true);
          try {
            await Spotify.authorize();
          } catch (authError) {
            console.error("Authorize error:", authError);
            setErrorMessage("Could not start Spotify authorization.");
            setShowErrorPopup(true);
          }
          return;
        }

        setSuccessMessage("");
        setShowSuccessPopup(false);
        setErrorMessage(error.message || "Spotify authorization failed.");
        setShowErrorPopup(true);
        return;
      }

      if (!token) {
        setSuccessMessage("");
        setShowSuccessPopup(false);
        setErrorMessage("Please authorize Spotify to save your playlist.");
        setShowErrorPopup(true);
        try {
          await Spotify.authorize();
          } catch (authError) {
            console.error("Authorize error:", authError);
            setErrorMessage("Could not start Spotify authorization.");
            setShowErrorPopup(true);
            }
            return;
            }

    const trackUris = playlistTracks.map((track) => track.uri);
    
    try {
      const userResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!userResponse.ok) throw new Error("Failed to get user");

    const userData = await userResponse.json();
    const userId = userData.id;

    const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      method: "POST",
      headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
      },
      body: JSON.stringify({
      name: trimmedPlaylistName,
      description: "Created with Jamming App",
      public: false
    })
    });

    if (!playlistResponse.ok) throw new Error("Failed to create playlist");
    
    const playlistData = await playlistResponse.json();
    const playlistId = playlistData.id;

    const addTrackResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: trackUris,
      }),
    });

    if (!addTrackResponse.ok) {
      throw new Error("Failed to add tracks to playlist");
    };

    setSuccessMessage(`Playlist "${trimmedPlaylistName}" was saved to Spotify.`);
    setShowSuccessPopup(true);
    // reset app playlist
    setPlaylistName('My Playlist');
    setPlaylistTracks([]);
  }
  catch (error) {
  console.error("Save Playlist Error:", error.message);
  setSuccessMessage("");
  setShowSuccessPopup(false);
  setErrorMessage("Could not save playlist to Spotify. Please try again.");
  setShowErrorPopup(true);
  }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>
          Ja<span style={{color:'purple'}}>mmm</span>ing
        </h1>
      </header>

      <SearchBar onSearch={searchTracks}/>
      {showErrorPopup && (
        <div className="modal-overlay">
          <div className="modal-window">
            <p>{errorMessage}</p>
            <button onClick={() => setShowErrorPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {showSuccessPopup && (
        <div className="modal-overlay">
          <div className="modal-window">
            <p>{successMessage}</p>
            <button onClick={() => setShowSuccessPopup(false)}>Close</button>
          </div>
        </div>  
      )}

      <div className="main-layout-container">
        <SearchResults searchResults={searchResults} onAdd={addTrack}/>
        <Playlist
        playlistName={playlistName}
        playlistTracks={playlistTracks} 
        onRemove={removeTrack}
        setPlaylistName={setPlaylistName}
        onSave={savePlaylist}
        />
      </div>

    </div>

 );
}

export default App; 