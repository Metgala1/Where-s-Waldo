import { useContext, useEffect, useState } from "react";
import { GameContext } from "../gameContext/gameContext";
import TargetBox from "../components/TargetBox";

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

  // --- NEW STATE ---
  const [targetBox, setTargetBox] = useState(null); // where user clicks
  const [markers, setMarkers] = useState([]); // correct character markers
  const [remainingChars, setRemainingChars] = useState(characters || []);

  // Start timer once image is loaded
  useEffect(() => {
    if (image && !loading) startTimer();
    return () => stopTimer(); // cleanup
  }, [image, loading, startTimer, stopTimer]);

  // Keep remaining characters updated with context
  useEffect(() => {
    setRemainingChars(characters);
  }, [characters]);

  if (loading) return <p>Loading image...</p>;
  if (!image) return <p>No image available</p>;

  // --- Handle click on the image ---
  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTargetBox({ x, y });
  };

  // --- Handle selection from TargetBox ---
  const handleSelection = async (characterId) => {
    if (!targetBox) return;

    try {
      const res = await fetch("http://localhost:4000/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageId: image.id,
          characterId,
          clickX: targetBox.x,
          clickY: targetBox.y,
        }),
      });
      const data = await res.json();

      if (data.correct) {
        // Add marker at real position
        setMarkers((prev) => [
          ...prev,
          { x: data.character.x, y: data.character.y, id: characterId },
        ]);

        // Remove from dropdown
        setRemainingChars((prev) =>
          prev.filter((c) => c.id !== parseInt(characterId))
        );

        if (remainingChars.length - 1 === 0) {
          completeGame("Player1");
        }
      } else {
        alert("❌ Wrong guess! Try again.");
      }
    } catch (err) {
      console.error(err);
    }

    setTargetBox(null); // close box after selection
  };

  const handleFinish = () => {
    completeGame("Player1"); // stopTimer is already called inside completeGame
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Where’s Waldo - Rick & Morty Edition</h1>

      <p>⏱ Time: {time}s</p>

      <div style={{ position: "relative", display: "inline-block" }}>
        <img
          src={image.url}
          alt="Game"
          onClick={handleImageClick}
          style={{ maxWidth: "90%", height: "auto", border: "2px solid black" }}
        />

        {/* Targeting box */}
        {targetBox && (
          <TargetBox
            x={targetBox.x}
            y={targetBox.y}
            characters={remainingChars}
            onSelect={handleSelection}
            onClose={() => setTargetBox(null)}
          />
        )}

        {/* Correct markers */}
        {markers.map((m) => (
          <div
            key={m.id}
            style={{
              position: "absolute",
              left: m.x,
              top: m.y,
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "green",
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      <p>
        Characters to find:{" "}
        {remainingChars && remainingChars.length > 0
          ? remainingChars.map((c) => c.name).join(", ")
          : "🎉 All found!"}
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
