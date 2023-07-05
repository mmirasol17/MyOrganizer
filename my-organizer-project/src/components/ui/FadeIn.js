import React, { useState, useEffect } from "react";

function FadeIn({ fadeDelay = 500, children }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="transition-opacity">
      <div
        className={`
          duration-${fadeDelay} ease-in-out
          ${isMounted ? "opacity-100" : "opacity-0"}
        `}
      >
        {children}
      </div>
    </div>
  );
}

export default FadeIn;
