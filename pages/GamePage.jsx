import { useContext, useEffect } from "react";
import { GameContext } from "../gameContext/gameContext";

function GamePage() {
  const {
    image,
    startTimer,
    stopTimer,
    characters,
    loading,
    time,
    gameOver,
    completeGame,
  } = useContext(GameContext);

  // Start timer once image is loaded
  useEffect(() => {
    if (image && !loading) startTimer();
    return () => stopTimer(); // cleanup
  }, [image, loading, startTimer, stopTimer]);

  if (loading) return <p>Loading image...</p>;
  if (!image) return <p>No image available</p>;

  const handleFinish = () => {
    completeGame("Player1"); // stopTimer is already called inside completeGame
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Where’s Waldo - Rick & Morty Edition</h1>

      <p>⏱ Time: {time}s</p>

      <img
        src={image.url}
        alt="Game"
        style={{ maxWidth: "90%", height: "auto", border: "2px solid black" }}
      />

      <p>
        Characters to find:{" "}
        {characters && characters.length > 0
          ? characters.map((c) => c.name).join(", ")
          : "None"}
      </p>

      {!gameOver ? (
        <button onClick={handleFinish}>Finish Game</button>
      ) : (
        <p>🎉 Game Over! Final Time: {time}s</p>
      )}
    </div>
  );
}

export default GamePage;
