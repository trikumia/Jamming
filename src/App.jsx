import React from "react";
import SearchBar from "./Components/SearchBar";
import SearchResults from "./Components/SearchResults";
import Playlist from "./Components/Playlist";

function App() {
  return (

    <div>
      <h1>Ja<span style={{color:'purple'}}>mmm</span>ing</h1>

      <SearchBar />

      <div>
        <SearchResults />
        <Playlist />
      </div>

    </div>

  );
}

export default App; 