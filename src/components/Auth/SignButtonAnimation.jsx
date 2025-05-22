import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SplitSwitchButton = () => {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const handleClick = (side) => {
    setSelected(side);
    navigate(side === "signin" ? "/signin" : "/signup");
  };

  return (
    <div
      className="relative w-48 h-12 rounded-full border border-transparent backdrop-blur-lg  cursor-pointer select-none overflow-hidden"
      onMouseLeave={() => setHovered(null)}
    >
    <button
      type="button"
      className="relative w-full h-full rounded-full text-white overflow-hidden select-none flex"
      onMouseLeave={() => setHovered(null)}
    >
      <div
        className={`absolute top-0 h-full bg-orange-500 rounded-full transition-all duration-300 ease-in-out ${
          hovered === "signin" || selected === "signin"
            ? "w-full left-0"
            : hovered === "signup" || selected === "signup"
            ? "w-full right-0"
            : "w-0"
        }`}
        style={{
          willChange: "width, left, right",
          transitionProperty: "width, left, right",
        }}
      />

      <div
        onMouseEnter={() => setHovered("signin")}
        onClick={() => handleClick("signin")}
        className={`relative z-10 flex items-center justify-center transition-all duration-300 ease-in-out
          ${
            hovered === "signin" || selected === "signin"
              ? "w-full absolute left-0 text-white font-semibold"
              : "w-1/2 text-orange-500"
          }`}
      >
        Sign In
      </div>

      <div
        onMouseEnter={() => setHovered("signup")}
        onClick={() => handleClick("signup")}
        className={`relative z-10 flex items-center justify-center transition-all duration-300 ease-in-out
          ${
            hovered === "signup" || selected === "signup"
              ? "w-full absolute left-0 text-white font-semibold"
              : "w-1/2 text-orange-500"
          }`}
      >
        Sign Up
      </div>
    </button>
    </div>
  );
};

export default SplitSwitchButton;
