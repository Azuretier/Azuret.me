"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WipeTransition({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    // Simulate background (rain shader) load finished
    const timer = setTimeout(() => {
      setIsLoaded(true);
      setTimeout(() => setShowOverlay(false), 800); // wait before wiping
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Website content */}
      {children}

      {/* Wipe Transition */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: "-100%" }} // wipe upward
            exit={{ y: "-100%" }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 bg-black z-[9999]"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
