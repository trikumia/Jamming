import React, {useState} from "react";
import SearchBar from "./Components/SearchBar";
import SearchResults from "./Components/SearchResults";
import Playlist from "./Components/Playlist";
import "./App.css";

function App() {

//create hardcoded search results state
  const [searchResults, setSearchResults] = useState([
    {id:"1", name:"Lipan Conjuring", artist:"Tool", album:"10,000 Days"},
    {id:"2", name:"Bleak", artist:"Opeth", album:"Blackwater Park"},
    {id:"3", name:"HourGlass", artist:"Lamb of God", album:"Ashes of the Wake"},
    {id:"4", name:"Dig Up Her Bones", artist:"Misfits", album:"Kill 'Em All i"},
    {id:"5", name:"Seek & Destroy", artist:"Metallica", album:"Kill 'Em All"},
    {id:"6", name:"Dog Days Are Over", artist:"Florence and the Machine", album:"Lungs"},
    {id:"7", name:"Monkey Business", artist:"Skid Row", album:"Slave To The Ground"},
    {id:"8", name:"Angry Chair", artist:"Alice in Chains", album:"Dirt"},
    {id:"9", name:"Fire Woman", artist:"The Cult", album:"Sonic Temple"},
    {id:"10", name:"Welcome to the Jungle", artist:"Guns n Roses", album:"Appetite for Destruction"}
  ]);

  return (

    <div className="app-container">
      <header className="app-header">
        <h1>Ja<span style={{color:'purple'}}>mmm</span>ing</h1>
      </header>
    

      <SearchBar />

      <div className="main-layout-container">
        <SearchResults searchResults={searchResults} />
        <Playlist />
      </div>

    </div>

  );
}

export default App; 