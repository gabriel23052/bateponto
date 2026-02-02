import { useEffect, useRef, useState } from "react";

import ClockDigit from "./ClockDigit";

import usePageVisibility from "../../hooks/usePageVisibility";
import { useClockContext } from "../../contexts/ClockContext";

import classes from "./Clock.module.css";

/**
 * Exibe um relógio com dígitos animados
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
      <span
        className={classes.acessibilityClock}
        aria-label="Relógio"
        aria-live="off"
      >{`${clock[0]}${clock[1]}:${clock[2]}${clock[3]}:${clock[4]}${clock[5]}`}</span>
      <ClockDigit digit={clock[0]} />
      <ClockDigit digit={clock[1]} />
      <span className="text-display" aria-hidden="true">:</span>
      <ClockDigit digit={clock[2]} />
      <ClockDigit digit={clock[3]} />
      <span className="text-display" aria-hidden="true">:</span>
      <ClockDigit digit={clock[4]} />
      <ClockDigit digit={clock[5]} />
    </section>
  );
};

export default Clock;
