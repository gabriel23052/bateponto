import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Props = {
  children: ReactNode;
};

/**
 * Um estado que reflete se a página está sendo mostrada para o úsuario
 */
const PageVisibilityContext = createContext<{ isVisible: boolean } | undefined>(
  undefined
);

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

const usePageVisibilityContext = () => {
  const ctx = useContext(PageVisibilityContext);
  if (ctx === undefined)
    throw new Error("PageVisibilityContextProvider not found");
  return ctx;
};

// eslint-disable-next-line react-refresh/only-export-components
export { PageVisibilityContextProvider, usePageVisibilityContext };
