import React, { createContext, useState, useEffect, useRef } from "react";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [image, setImage] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [session, setSession] = useState(null);
  const [time, setTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setLoading(true);

        // 1. Get images
        const res = await fetch("http://localhost:4000/api/images");
        const images = await res.json();
        if (!images || images.length === 0) throw new Error("No images found");
        const img = images[0];
        setImage(img);

        // 2. Get characters for this image
        const charRes = await fetch(
          `http://localhost:4000/api/images/${img.id}/characters`
        );
        const chars = await charRes.json();
        setCharacters(chars || []);

        // 3. Start a session in backend
        const sessionRes = await fetch("http://localhost:4000/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageId: img.id }),
        });
        const sessionData = await sessionRes.json();
        setSession(sessionData);

        // 4. Reset timer
        setTime(0);
        setGameOver(false);
        startTimer();
      } catch (err) {
        console.error("Error fetching game data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();

    return () => stopTimer(); // cleanup
  }, []);

  // --- Timer ---
  const startTimer = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // --- Complete Game ---
  const completeGame = async (playerName) => {
    stopTimer();
    setGameOver(true);

    if (!session) return;

    try {
      await fetch(
        `http://localhost:4000/api/sessions/${session.id}/complete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerName,
            timeTaken: time,
          }),
        }
      );
    } catch (err) {
      console.error("Error completing game:", err);
    }
  };

  return (
    <GameContext.Provider
      value={{
        image,
        characters,
        loading,
        session,
        time,
        gameOver,
        startTimer,
        stopTimer,
        completeGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
