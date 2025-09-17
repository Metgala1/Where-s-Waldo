import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [image, setImage] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/images");
        const img = res.data[0]; // first image
        setImage(img);

        const charRes = await axios.get(
          `http://localhost:4000/api/images/${img.id}/characters`
        );
        setCharacters(charRes.data);
      } catch (err) {
        console.error("Error fetching game data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, []);

  return (
    <GameContext.Provider
      value={{
        image,
        characters,
        loading,
        session,
        setSession,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
