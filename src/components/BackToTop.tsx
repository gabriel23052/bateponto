import { useEffect, useState } from "react";

import ArrowIcon from "../assets/icons/arrow.svg?react";

import classes from "./BackToTop.module.css";

const DEBOUNCE_DELAY = 200;
const OFFSET_TO_SHOW_SHORTCUT = 200;

/**
 * Exibe o botão para voltar ao topo da página
 */
const BackToTop = () => {
  const [showShortcut, setShowShortcut] = useState(false);

  useEffect(() => {
    const debouncedScrollHandler = (() => {
      let timeout: number | null = null;
      return () => {
        if (timeout !== null) clearTimeout(timeout);
        timeout = null;
        timeout = setTimeout(() => {
          setShowShortcut(window.scrollY > OFFSET_TO_SHOW_SHORTCUT);
        }, DEBOUNCE_DELAY);
      };
    })();
    document.addEventListener("scroll", debouncedScrollHandler);
    return () => {
      document.removeEventListener("scroll", debouncedScrollHandler);
    };
  }, []);

  const clickHandler = () => {
    window.scroll({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      className={`bg-neutral-darkgray ${classes.button}`}
      style={{ opacity: showShortcut ? "1" : "0" }}
      title="Voltar para o ínicio"
      onClick={clickHandler}
    >
      <ArrowIcon width={24} height={24} aria-hidden="true" />
    </button>
  );
};

export default BackToTop;

