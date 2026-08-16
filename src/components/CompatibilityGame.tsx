import { useState } from "react";
import { motion } from "framer-motion";
import "./CompatibilityGame.css";

// Questions for the game
const questions = [
  { question: "Mountains or Beaches?", options: ["🏔 Mountains", "🏖 Beaches"] },
  { question: "Indoor or Outdoor?", options: ["🏠 Indoor", "🌳 Outdoor"] },
  { question: "Planned Trips or Spontaneous Trips?", options: ["📅 Planned", "🎒 Spontaneous"] },
  { question: "Tea or Coffee?", options: ["🍵 Tea", "☕ Coffee"] },
  { question: "45, 18 or 7?", options: ["45", "18", "7"] },
];

// Romantic-Funny Lines
const resultLines = [
  "The universe just confirmed it.",
  "Well… looks like you’re stuck with me now 😏",
  "Doctors recommend a date immediately.",
  "The stars have signed the contract.",
  "Breaking news: We’re illegally cute.",
  "Even the algorithm said YES.",
  "Even Cupid is impressed right now.",
];

// Import images from the photos folder
import photo1 from "../../photos/photo_1.jpeg";
import photo2 from "../../photos/photo_2.jpeg";
import photo3 from "../../photos/photo_3.jpeg";
import photo4 from "../../photos/photo_4.jpeg";

const resultImages = [photo1, photo2, photo3, photo4];

export default function CompatibilityGame() {
  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [randomImages, setRandomImages] = useState<string[]>([]);

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1);
    } else {
      // Pick random romantic line
      const randomLine =
        resultLines[Math.floor(Math.random() * resultLines.length)];

      // Shuffle and pick all images
      const shuffledImages = [...resultImages].sort(() => Math.random() - 0.5);

      setResultMessage(randomLine);
      setRandomImages(shuffledImages);
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

      {/* Display Images Around the Edges */}
      {randomImages.slice(0, 4).map((img, index) => (
        <motion.img
          key={index}
          src={img}
          alt={`Romantic ${index}`}
          className={`edge-image edge-image-${index}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.3, duration: 0.8 }}
        />
      ))}

      {/* Display the 5th Image on Top of the Card */}
      {randomImages[4] && (
        <motion.img
          src={randomImages[4]}
          alt="Romantic Center"
          className="center-image"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        />
      )}
    </div>
  );
}