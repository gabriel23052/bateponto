import { useEffect, useState } from "react";

import Greeting from "./Greeting";
import Clock from "./Clock";
import DateText from "./DateText";
import ClockInSection from "./ClockInSection";
import TodayReport from "./TodayReport";
import History from "./History";
import ModalEditWrapper from "./modal/ModalEditWrapper";
import ArrowIcon from "../assets/icons/arrow.svg?react";

import { ClockContextProvider } from "../contexts/ClockContext";
import { EditContextProvider } from "../contexts/EditContext";

import classes from "./App.module.css";

const DEBOUNCE_DELAY = 200;
const OFFSET_TO_SHOW_SHORTCUT = 200;

/**
 * Componente container da aplicação
 */
const App = () => {
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
    <main className={classes.container}>
      <ClockContextProvider>
        <Greeting />
        <Clock />
        <DateText />
        <ClockInSection />
        <EditContextProvider>
          <TodayReport />
          <History />
          <ModalEditWrapper />
        </EditContextProvider>
      </ClockContextProvider>
      <button
        className={`bg-neutral-darkgray ${classes.shortcutButton}`}
        style={{ opacity: showShortcut ? "1" : "0" }}
        title="Voltar para o ínicio"
        onClick={clickHandler}
      >
        <ArrowIcon width={24} height={24} />
      </button>
    </main>
  );
};

export default App;
