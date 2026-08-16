import { useState } from "react";
import { motion } from "framer-motion";

const questions = [
  { question: "Mountains or Beaches?", options: ["🏔 Mountains", "🏖 Beaches"] },
  { question: "Indoor or Outdoor?", options: ["🏠 Indoor", "🌳 Outdoor"] },
  { question: "Planned Trips or Spontaneous Trips?", options: ["📅 Planned", "🎒 Spontaneous"] },
  { question: "Tea or Coffee?", options: ["🍵 Tea", "☕ Coffee"] },
  { question: "45, 18 or 7?", options: ["45", "18", "7"] },
];

// 🔥 Rotating Romantic-Funny Lines
const resultLines = [
  "The universe just confirmed it.",
  "Well… looks like you’re stuck with me now 😏",
  "Doctors recommend a date immediately.",
  "The stars have signed the contract.",
  "Breaking news: We’re illegally cute.",
  "Even the algorithm said YES.",
  "Even Cupid is impressed right now.",
];

export default function CompatibilityGame() {
  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [resultMessage, setResultMessage] = useState("");

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1);
    } else {
      const score = 92 + Math.floor(Math.random() * 8);
      setFinalScore(score);

      // Pick random romantic line
      const randomLine =
        resultLines[Math.floor(Math.random() * resultLines.length)];

      setResultMessage(randomLine);
      setFinished(true);
    }
  };

  return (
    <div className="game-screen">

      {/* Heading */}
      <motion.h1
        className="game-heading"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Vibe Check 😎
      </motion.h1>

      {/* Game Card */}
      <motion.div
        className="game-card"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {!finished ? (
          <>
            <h2>{questions[current].question}</h2>

            <div className="options">
              {questions[current].options.map((opt, i) => (
                <button key={i} onClick={next}>
                  {opt}
                </button>
              ))}
            </div>

            <div className="progress">
              {current + 1} / {questions.length}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
            className="result"
          >
            <h2>100% Compatible 💘</h2>

            <motion.p
              key={resultMessage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ marginTop: "15px" }}
            >
              {resultMessage}
            </motion.p>
          </motion.div>
        )}
      </motion.div>

      {/* Curtains */}
      <motion.div
        className="curtain curtain-left"
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />

      <motion.div
        className="curtain curtain-right"
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />

    </div>
  );
}
