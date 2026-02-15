import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

type Props = {
  onRevealComplete: () => void;
};

export default function CurtainTransition({ onRevealComplete }: Props) {
  const controls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      // Drop curtains
      await controls.start({
        y: 0,
        transition: { duration: 0.9, ease: [0.77, 0, 0.175, 1] },
      });

      // Pause (dramatic moment)
      await new Promise((res) => setTimeout(res, 600));

      // Raise curtains
      await controls.start({
        y: "-100%",
        transition: { duration: 1.2, ease: [0.65, 0, 0.35, 1] },
      });

      onRevealComplete();
    };

    sequence();
  }, [controls, onRevealComplete]);

  return (
    <motion.div
      className="theatre-curtain"
      initial={{ y: "-100%" }}
      animate={controls}
    >
      <div className="curtain-fold left" />
      <div className="curtain-fold right" />
    </motion.div>
  );
}
