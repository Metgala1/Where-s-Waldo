import { useContext } from "react";
import { GameContext } from "../gameContext/gameContext";

function GamePage() {
   const {image, characters, loading} = useContext(GameContext)

   if(loading) return <p>Loading game data...</p>;
   if(!image) return <p>No image available</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Where’s Waldo - Rick & Morty Edition</h1>
      <img
        src={image.url}
        alt="Game"
        style={{ maxWidth: "90%", height: "auto", border: "2px solid black" }}
      />
      <p>Characters to find: {characters.map(c => c.name).join(", ")}</p>
    </div>
  );
}

export default GamePage;
