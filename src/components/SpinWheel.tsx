import { useState } from "react";
import { motion } from "framer-motion";

type Props = {
  onComplete: () => void;
};

const segments = [
  { label: "🍦 Ice Cream", color: "#ff6b6b" },
  { label: "🎬 Movie Night", color: "#845ef7" },
  { label: "🚗 Long Drive", color: "#339af0" },
  { label: "💞 Vibe Check", color: "#20c997" },
];

export default function SpinWheel({ onComplete }: Props) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);

  const segmentAngle = 360 / segments.length;
  const radius = 130;

  const spin = () => {
    if (spinning) return;
  
    setSpinning(true);
    setWinnerIndex(null);
  
    const compatibilityIndex = segments.findIndex((s) =>
      s.label.includes("Compatibility")
    );
  
    const spins = 6;
  
    const targetAngle =
      compatibilityIndex * segmentAngle + segmentAngle / 2;
  
    // 🔥 IMPORTANT FIX: subtract 90° because conic starts at right
    const finalRotation =
      spins * 360 + (270 - targetAngle);
  
    setRotation(finalRotation);
  
    setTimeout(() => {
      setWinnerIndex(compatibilityIndex);
  
      setTimeout(() => {
        onComplete();
      }, 2000);
  
      setSpinning(false);
    }, 5000);
  };
  

  return (
    <div className="wheel-wrapper">
      <div className="wheel-container">
        <div className="pointer" />

        <motion.div
          className="wheel"
          animate={{ rotate: rotation }}
          transition={{
            duration: 5,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            background: `conic-gradient(
              ${segments
                .map(
                  (s, i) =>
                    `${s.color} ${i * segmentAngle}deg ${
                      (i + 1) * segmentAngle
                    }deg`
                )
                .join(",")}
            )`,
          }}
        >
          {segments.map((seg, i) => {
            const angle = i * segmentAngle + segmentAngle / 2;
            const rad = (angle * Math.PI) / 180;

            const x = radius * Math.cos(rad);
            const y = radius * Math.sin(rad);

            return (
              <div
                key={i}
                className={`wheel-label ${
                  winnerIndex === i ? "winner" : ""
                }`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                }}
              >
                {seg.label}
              </div>
            );
          })}
        </motion.div>
      </div>

      <button className="spin-btn" onClick={spin} disabled={spinning}>
        {spinning ? "Spinning..." : "Spin the Wheel 🎡"}
      </button>
    </div>
  );
}
