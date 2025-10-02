// gameContext/gameContext.jsx
import React, { createContext, useState, useEffect, useRef } from "react";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [image, setImage] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/images") // adjust backend URL
      .then((res) => res.json())
      .then((data) => {
        setImage(data[0]); 
        setCharacters(data[0].characters);
        setLoading(false);
      });
  }, []);

  const startTimer = () => {
    if (timerRef.current) return; 
    timerRef.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const completeGame = async (playerName) => {
    stopTimer();
    setGameOver(true);

    // Save session to backend
    await saveSession(playerName);
  };

  const saveSession = async (playerName) => {
    try {
      await fetch("http://localhost:4000/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName,
          imageId: image.id,
          timeTaken: time,
        }),
      });
    } catch (err) {
      console.error("Error saving session:", err);
    }
  };

  return (
    <GameContext.Provider
      value={{
        image,
        characters,
        loading,
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
