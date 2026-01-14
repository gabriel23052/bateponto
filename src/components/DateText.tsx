import { useEffect, useRef, useState } from "react";

import classes from "./DateText.module.css";

const DAYS_OF_WEEK = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
];

const MONTHS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

const DATE_REFRESH_DELAY = 1000;

/** 
 * Data em formato extendido "DIA_DA_SEMANA, DIA de MÊS de ANO"
 */
const DateText = () => {
  const getDate = () => {
    const now = new Date();
    return `${DAYS_OF_WEEK[now.getDay()]}, ${now.getDate()}${
      now.getDate() === 1 ? "º" : ""
    } de ${MONTHS[now.getMonth()]} de ${now.getFullYear()}`;
  };

  const [dateText, setDateText] = useState(getDate());

  const timeout = useRef<number>(null);

  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    const timestamp = tomorrow.getTime() - now.getTime() + DATE_REFRESH_DELAY;
    timeout.current = window.setTimeout(() => {
      setDateText(getDate());
    }, timestamp);
    return () => {
      if (timeout.current !== null) {
        clearTimeout(timeout.current);
      }
    };
  }, [dateText]);

  return (
    <p className={`neutral-dark text-large ${classes.text}`}>{dateText}</p>
  );
};

export default DateText;
