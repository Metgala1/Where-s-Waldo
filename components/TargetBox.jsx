// components/TargetBox.jsx
import React, { useEffect, useRef } from "react";

const TargetBox = ({ x, y, characters, onSelect, onClose }) => {
  const boxRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={boxRef}
      style={{
        position: "absolute",
        left: x,
        top: y,
        border: "2px solid red",
        padding: "5px",
        background: "white",
        zIndex: 10,
      }}
    >
      <select onChange={(e) => onSelect(e.target.value)} defaultValue="">
        <option value="" disabled>
          Select character
        </option>
        {characters.map((char) => (
          <option key={char.id} value={char.id}>
            {char.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TargetBox;
