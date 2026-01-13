"use client";

import { memo } from "react";

interface StaticBackgroundProps {
  onLoaded?: () => void;
}

const StaticBackground = memo(({ onLoaded }: StaticBackgroundProps) => {
  // Trigger onLoaded immediately since it's static
  if (onLoaded) {
    setTimeout(onLoaded, 0);
  }

  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        background:
          "linear-gradient(to bottom, rgb(12, 25, 51) 0%, rgb(51, 38, 77) 40%, rgb(204, 76, 128) 100%)",
      }}
    />
  );
});

StaticBackground.displayName = "StaticBackground";

export default StaticBackground;
