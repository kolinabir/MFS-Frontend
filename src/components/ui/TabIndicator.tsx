"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type TabIndicatorProps = {
  activeTabId: string;
};

export const TabIndicator = ({ activeTabId }: TabIndicatorProps) => {
  const [dimensions, setDimensions] = useState({ width: 0, left: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      const element = document.getElementById(`tab-${activeTabId}`);
      if (element) {
        const { offsetWidth, offsetLeft } = element;
        setDimensions({ width: offsetWidth, left: offsetLeft });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [activeTabId]);

  return (
    <motion.div
      className="absolute bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400"
      initial={false}
      animate={{ width: dimensions.width, x: dimensions.left }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    />
  );
};
