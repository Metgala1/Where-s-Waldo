import { useEffect } from "react";

function TargetBox({ x, y, characters = [], onSelect, onClose }) {
  // --- Close on outside click ---
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".target-box")) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      className="target-box"
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        background: "white",
        border: "2px solid red",
        padding: "8px",
        zIndex: 10,
      }}
    >
      <select
        defaultValue=""
        onChange={(e) => {
          if (e.target.value) {
            onSelect(e.target.value);
          }
        }}
      >
        <option value="" disabled>
          Select character
        </option>
        {characters.length > 0 ? (
          characters.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))
        ) : (
          <option disabled>No characters</option>
        )}
      </select>

      <button
        onClick={onClose}
        style={{
          marginLeft: "5px",
          background: "transparent",
          border: "none",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        ✖
      </button>
    </div>
  );
}

export default TargetBox;
