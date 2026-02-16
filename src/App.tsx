import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import SpinWheel from "./components/SpinWheel";
import CompatibilityGame from "./components/CompatibilityGame";
import "./App.css";

type HeartTrail = {
  id: number;
  x: number;
  y: number;
};

type Stage = "question" | "celebration" | "wheel" | "curtain" | "game";

const firstEmoji = "😭";
const funnyEmojis = ["😂", "🤣", "😡", "😜", "🤪", "😝", "🤬", "😆", "😈"];

const introMessage =
  "Hi Siyaaa, I have something to ask you...";

function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const noBtnRef = useRef<HTMLButtonElement | null>(null);
  const yesBtnRef = useRef<HTMLButtonElement | null>(null);

  const [stage, setStage] = useState<Stage>("question");
  const [showQuestion, setShowQuestion] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [trailHearts, setTrailHearts] = useState<HeartTrail[]>([]);
  const [emojiIndex, setEmojiIndex] = useState(-1);
  const [yesScale, setYesScale] = useState(1);
  const [noPosition, setNoPosition] = useState<{ top?: number; left?: number }>({});
  const [hasMoved, setHasMoved] = useState(false);
  const [curtainPhase, setCurtainPhase] = useState<"drop" | "lift">("drop");

  /* Intro Typewriter */
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(introMessage.slice(0, index + 1));
      index++;
      if (index === introMessage.length) clearInterval(interval);
    }, 50);

    const timer = setTimeout(() => setShowQuestion(true), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  /* Mouse Trail */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setTrailHearts((prev) => [
        ...prev.slice(-10),
        { id: Date.now(), x: e.clientX, y: e.clientY },
      ]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const isOverlapping = (
    newLeft: number,
    newTop: number,
    width: number,
    height: number,
    yesRect: DOMRect,
    containerRect: DOMRect
  ) => {
    const yesLeft = yesRect.left - containerRect.left;
    const yesTop = yesRect.top - containerRect.top;

    return !(
      newLeft + width < yesLeft ||
      newLeft > yesLeft + yesRect.width ||
      newTop + height < yesTop ||
      newTop > yesTop + yesRect.height
    );
  };

  const startCurtainTransition = () => {
    setStage("curtain");
    setCurtainPhase("drop");
  
    setTimeout(() => {
      setCurtainPhase("lift");
  
      setTimeout(() => {
        setStage("game");
      }, 1400);
    }, 900);
  };
  

  const moveNoButton = () => {
    const container = containerRef.current;
    const button = noBtnRef.current;
    const yesButton = yesBtnRef.current;

    if (!container || !button || !yesButton) return;

    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const yesRect = yesButton.getBoundingClientRect();

    const maxX = containerRect.width - buttonRect.width;
    const maxY = containerRect.height - buttonRect.height;

    if (!hasMoved) {
      const currentLeft = buttonRect.left - containerRect.left;
      const currentTop = buttonRect.top - containerRect.top;
      setNoPosition({ left: currentLeft, top: currentTop });
      setHasMoved(true);
      return;
    }

    let newLeft = 0;
    let newTop = 0;
    let attempts = 0;

    do {
      newLeft = Math.random() * maxX;
      newTop = Math.random() * maxY;
      attempts++;
    } while (
      isOverlapping(
        newLeft,
        newTop,
        buttonRect.width,
        buttonRect.height,
        yesRect,
        containerRect
      ) &&
      attempts < 40
    );

    setNoPosition({ left: newLeft, top: newTop });

    setEmojiIndex((prev) => {
      if (prev === -1) return 0;
      return (prev + 1) % funnyEmojis.length;
    });

    setYesScale((prev) => Math.min(prev + 0.15, 2.2));
  };

  const handleYes = () => {
    setStage("celebration");

    confetti({
      particleCount: 250,
      spread: 110,
      origin: { y: 0.6 },
    });
  };

  const currentEmoji =
    emojiIndex === -1 ? firstEmoji : funnyEmojis[emojiIndex];

    const generateHeartPoints = (scale: number, density: number) => {
      const points = [];
    
      for (let t = 0; t < Math.PI * 2; t += density) {
        const x =
          16 * Math.pow(Math.sin(t), 3);
        const y =
          13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t);
    
        points.push({
          x: x * scale,
          y: -y * scale,
        });
      }
    
      return points;
    };
    
    // Two layers for richness
    const outerHeart = generateHeartPoints(14, 0.08);
    const innerHeart = generateHeartPoints(11, 0.08);
    
    

  return (
    <motion.div
      className={`app ${stage !== "question" ? "cinematic" : ""}`}
      ref={containerRef}
      animate={
        stage !== "question"
          ? {
              background: [
                "linear-gradient(135deg, #ff9a9e, #fad0c4)",
                "linear-gradient(135deg, #ff758c, #ffb199)",
                "linear-gradient(135deg, #ff9a9e, #fad0c4)",
              ],
            }
          : {
              background: "linear-gradient(135deg, #ff9a9e, #fad0c4)",
            }
      }
      transition={{ duration: 6, repeat: Infinity }}
    >
      {/* Background Hearts */}
      <div className="background-hearts">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="heart-wrapper"
            style={{
              left: `${10 + i * 10}%`,
              animationDelay: `${i * 2}s`,
            }}
          >
            <div className="heart">💖</div>
          </div>
        ))}
      </div>

      {/* Mouse Trail */}
      {trailHearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="trail-heart"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 0.8 }}
          style={{ left: heart.x, top: heart.y }}
        >
          💗
        </motion.div>
      ))}

      <AnimatePresence mode="wait">

        {stage === "question" && (
          <motion.div
            key="question"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {!showQuestion && (
              <div className="intro-container">
                <div className="speech-bubble">{typedText}</div>
              </div>
            )}

            {showQuestion && (
              <div className="content">
                <h1>Would you like to come with me on a date?</h1>

                <div className="buttons">
                  <motion.button
                    ref={yesBtnRef}
                    className="yes-btn"
                    animate={{ scale: yesScale }}
                    transition={{ type: "spring", stiffness: 200 }}
                    onClick={handleYes}
                  >
                    Yes 💕
                  </motion.button>

                  <motion.button
                    ref={noBtnRef}
                    className={`no-btn ${hasMoved ? "absolute" : ""}`}
                    initial={false}
                    animate={hasMoved ? noPosition : undefined}
                    transition={{ type: "spring", stiffness: 120 }}
                    onMouseEnter={moveNoButton}
                    onClick={moveNoButton}
                  >
                    {currentEmoji} No
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {stage === "celebration" && (
          <motion.div
            key="celebration"
            className="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="heart-container">
            <div className="heart-wrapper-container">

  {/* OUTER HEART */}
  {outerHeart.map((point, index) => (
    <motion.div
      key={`outer-${index}`}
      className="heart-outline outer"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.01,
        duration: 0.3,
      }}
      style={{
        left: `calc(50% + ${point.x}px)`,
        top: `calc(50% + ${point.y}px)`,
      }}
    >
      💖
    </motion.div>
  ))}

  {/* INNER HEART */}
  {innerHeart.map((point, index) => (
    <motion.div
      key={`inner-${index}`}
      className="heart-outline inner"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.01 + 0.5,
        duration: 0.3,
      }}
      style={{
        left: `calc(50% + ${point.x}px)`,
        top: `calc(50% + ${point.y}px)`,
      }}
    >
      💗
    </motion.div>
  ))}

  <motion.div
    className="success-text"
    initial={{ scale: 0 }}
    animate={{ scale: [1, 1.08, 1] }}
    transition={{ duration: 3, repeat: Infinity }}
  >
    She said YES!!! 💘
  </motion.div>

</div>



              <div className="dramatic-text">
                Best decision of 2026 🤭
              </div>

              <button
                className="launch-wheel"
                onClick={() => setStage("wheel")}
              >
                Let’s Spin Our Date Wheel 🎡
              </button>
            </div>
          </motion.div>
        )}

{/* WHEEL (stays during curtain drop) */}
{(stage === "wheel" || stage === "curtain") && (
  <motion.div
    key="wheel"
    initial={{ x: "100%" }}
    animate={{ x: 0 }}
    exit={{ x: "-100%" }}
    transition={{ duration: 0.8 }}
    className="wheel-screen"
  >
    <SpinWheel onComplete={startCurtainTransition} />
  </motion.div>
)}

{/* GAME (mounts underneath curtain) */}
{(stage === "game" || stage === "curtain") && (
  <motion.div
    key="game"
    initial={{ opacity: 0 }}
    animate={{ opacity: stage === "game" ? 1 : 0 }}
    className="game-screen"
    style={{ position: "absolute", width: "100%", height: "100%" }}
  >
    <CompatibilityGame />
  </motion.div>
)}

{/* CURTAIN OVERLAY */}
{stage === "curtain" && (
  <motion.div
    key="curtain"
    className="curtain-layer"
    initial={{ y: "-100%" }}
    animate={{ y: curtainPhase === "drop" ? "0%" : "-100%" }}
    transition={{ duration: 1, ease: [0.77, 0, 0.175, 1] }}
    style={{ zIndex: 9999 }}
  />
)}


      </AnimatePresence>
    </motion.div>
  );
}

export default App;

