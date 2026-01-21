import { useEffect, useRef, useState } from "react";

import ClockDigit from "./ClockDigit";

import usePageVisibility from "../hooks/usePageVisibility";
import { useClockContext } from "../contexts/ClockContext";

import classes from "./Clock.module.css";

/**
 * Componente do relógio animado
 */
const Clock = () => {
  const getDigits = () =>
    Date()
      .toString()
      .substring(16, 24)
      .replaceAll(":", "")
      .split("") as TDigit[];

  const [clock, setClock] = useState<TDigit[]>(getDigits);

  const { inActivity } = useClockContext();

  const isVisible = usePageVisibility();

  const interval = useRef<number>(null);

  useEffect(() => {
    if (isVisible) {
      interval.current = setInterval(() => {
        setClock(getDigits);
      }, 1000);
    } else {
      if (interval.current !== null) {
        clearInterval(interval.current);
      }
    }
    return () => {
      if (interval.current !== null) {
        clearInterval(interval.current);
      }
    };
  }, [isVisible]);

  return (
    <section
      className={`${inActivity ? "activity" : "standby"} ${classes.container}`}
    >
      <ClockDigit digit={clock[0]} />
      <ClockDigit digit={clock[1]} />
      <span className="text-display">:</span>
      <ClockDigit digit={clock[2]} />
      <ClockDigit digit={clock[3]} />
      <span className="text-display">:</span>
      <ClockDigit digit={clock[4]} />
      <ClockDigit digit={clock[5]} />
    </section>
  );
};

export default Clock;
