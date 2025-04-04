import { useState, useEffect } from "react";

export function UseScreenWidth() {
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 900);

  useEffect(() => {
    const handleResize = () => setIsWideScreen(window.innerWidth > 900);
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isWideScreen;
}
