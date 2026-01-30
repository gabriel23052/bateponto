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

const DATE_REFRESH_DELAY = 100;

/**
 * Exibe a data do dia corrente
 */
const DateText = () => {
  const getDate = () => {
    const nowDate = new Date();
    return `${DAYS_OF_WEEK[nowDate.getDay()]}, ${nowDate.getDate()}${
      nowDate.getDate() === 1 ? "º" : ""
    } de ${MONTHS[nowDate.getMonth()]} de ${nowDate.getFullYear()}`;
  };

  const [dateText, setDateText] = useState(getDate());

  const timeout = useRef<number>(null);

  useEffect(() => {
    const nowDate = new Date();
    const tomorrowDate = new Date(nowDate);
    tomorrowDate.setHours(0, 0, 0, 0);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const difference =
      tomorrowDate.getTime() - nowDate.getTime() + DATE_REFRESH_DELAY;
    timeout.current = window.setTimeout(() => {
      setDateText(getDate());
    }, difference);
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
