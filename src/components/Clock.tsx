import { useEffect, useRef, useState } from "react";

import ClockDigit from "./ClockDigit";
import { PageVisibilityContextProvider } from "../contexts/PageVisibilityContext";

import classes from "./Clock.module.css";

/**
 * Relógio animado
 */
const Clock = () => {
  const getDigits = () =>
    Date()
      .toString()
      .substring(16, 24)
      .replaceAll(":", "")
      .split("") as Digit[];

  const [clock, setClock] = useState<Digit[]>(getDigits);

  const interval = useRef<number>(null);

  useEffect(() => {
    interval.current = setInterval(() => {
      setClock(getDigits);
    }, 1000);
    return () => {
      if (interval.current !== null) {
        clearInterval(interval.current);
      }
    };
  }, []);

  return (
    <section className={`${classes.container}`}>
      <PageVisibilityContextProvider>
        <ClockDigit digit={clock[0]} />
        <ClockDigit digit={clock[1]} />
        <span className="text-display standby">:</span>
        <ClockDigit digit={clock[2]} />
        <ClockDigit digit={clock[3]} />
        <span className="text-display standby">:</span>
        <ClockDigit digit={clock[4]} />
        <ClockDigit digit={clock[5]} />
      </PageVisibilityContextProvider>
    </section>
  );
};

export default Clock;
