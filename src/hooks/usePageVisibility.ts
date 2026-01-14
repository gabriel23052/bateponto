import { useEffect, useState } from "react";

/**
 * Hook com estado que reflete se a página está visivel para o usuário
 */
export default function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    const handler = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener("visibilitychange", handler);
    return () => {
      document.removeEventListener("visibilitychange", handler);
    };
  }, []);

  return isVisible;
}
