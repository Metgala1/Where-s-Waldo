import { createContext, useState, useEffect, useRef } from "react";
import axios from "axios";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [image, setImage] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [session, setSession] = useState(null);
  const [time, setTime] = useState(0); // seconds
  const [gameOver, setGameOver] = useState(false);

  const timerRef = useRef(null);

  // --- Fetch image + characters + create session ---
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setLoading(true);

        const res = await axios.get("http://localhost:4000/api/images");
        const img = res.data[0];
        if (!img) throw new Error("No image found");
        setImage(img);

        const charRes = await axios.get(
          `http://localhost:4000/api/images/${img.id}/characters`
        );
        setCharacters(charRes.data || []);

        const sessionRes = await axios.post(
          "http://localhost:4000/api/sessions",
          { imageId: img.id }
        );
        setSession(sessionRes.data);

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

    return () => stopTimer(); // cleanup on unmount
  }, []);

  // --- Timer Functions ---
  const startTimer = () => {
    if (timerRef.current) return; // prevent multiple intervals
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
      await axios.post(
        `http://localhost:4000/api/sessions/${session.id}/complete`,
        {
          timeTaken: time,
          playerName,
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
        completeGame,
        startTimer,
        stopTimer,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
