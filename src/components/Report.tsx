import ReportDate from "./ReportDate";
import TimestampList from "./TimestampList";

import ClockIcon from "../assets/icons/clock.svg?react";
import AlertIcon from "../assets/icons/alert.svg?react";

import { useActivityContext } from "../contexts/ActivityContext";

import classes from "./Report.module.css";

type Props = {
  dayReport: TReportView;
};

/**
 * Exibe o histórico de períodos de um terminado dia
 */
const Report = ({ dayReport }: Props) => {
  const { inActivity } = useActivityContext();

  return (
    <button
      className={`bg-neutral-white ${classes.button} ${
        inActivity ? classes.activity : ""
      }`}
    >
      <ReportDate date={dayReport.date} />
      <TimestampList timestamps={dayReport.checkpoints} />
      <div className={classes.sum}>
        <div>
          {dayReport.missingCheckpoint && (
            <AlertIcon width={20} height={20} className={classes.alert} />
          )}
          <ClockIcon
            className={inActivity ? classes.activity : ""}
            width={21}
            height={24}
          />
        </div>
        <p className="neutral-dark text-large">{dayReport.sum}</p>
      </div>
    </button>
  );
};

export default Report;
