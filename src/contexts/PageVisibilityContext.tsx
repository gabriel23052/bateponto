import { createContext, useEffect, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * Um estado que reflete se a página está sendo mostrada para o úsuario
 */
const PageVisibilityContext = createContext({ isVisible: true });

const PageVisibilityContextProvider = ({ children }: Props) => {
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

  return (
    <PageVisibilityContext value={{ isVisible }}>
      {children}
    </PageVisibilityContext>
  );
};

export { PageVisibilityContext, PageVisibilityContextProvider };
