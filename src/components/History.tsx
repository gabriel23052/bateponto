import { useEffect, useRef } from "react";

import Report from "./report/Report";

import { useClockContext } from "../contexts/ClockContext";

import classes from "./History.module.css";

const OBSERVER_HEIGHT = "4rem";

/**
 * Componente que exibe o histórico de batidas
 */
const History = () => {
  const { reports, orderMoreReports } = useClockContext();
  const observerElement = useRef<HTMLDivElement>(null);

  const observer = useRef(
    new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        if (entries[0].isIntersecting) {
          orderMoreReports();
        }
      },
      {
        threshold: 1,
      },
    ),
  );

  useEffect(() => {
    if (observerElement.current === null) return;
    observer.current.observe(observerElement.current);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      observer.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (reports.reachedEnd) observer.current.disconnect();
  }, [reports.reachedEnd]);

  return (
    <section className={classes.container}>
      <h2 className={`neutral-dark text-large ${classes.title}`}>Histórico</h2>
      <ul className={classes.list}>
        {reports.data.slice(1).map((report) => (
          <li key={report.timestampId}>
            <Report report={report} />
          </li>
        ))}
      </ul>
      <div ref={observerElement} style={{ height: OBSERVER_HEIGHT }}></div>
    </section>
  );
};

export default History;
