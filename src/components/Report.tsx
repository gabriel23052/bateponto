import ReportDate from "./ReportDate";
import CheckpointList from "./CheckpointList";

import { useClockContext } from "../contexts/ClockContext";

import ClockIcon from "../assets/icons/clock.svg?react";
import AlertIcon from "../assets/icons/alert.svg?react";

import classes from "./Report.module.css";

type Props = {
  report: TReportView;
  disableAlert?: boolean;
};

/**
 * Exibe o histórico de períodos de um determinado dia
 */
const Report = ({ report, disableAlert }: Props) => {
  const { inActivity } = useClockContext();

  return (
    <button
      className={`bg-neutral-white ${classes.button} ${
        inActivity ? classes.activity : ""
      }`}
    >
      <ReportDate date={report.date} />
      {report.checkpoints.length === 0 ? (
        <p className={`neutral-lightgray text-default ${classes.noActivity}`}>
          Sem atividade
        </p>
      ) : (
        <>
          <CheckpointList checkpoints={report.checkpoints} />
          <div className={classes.sum}>
            <div>
              {report.missingCheckpoint && !disableAlert && (
                <AlertIcon width={20} height={20} className={classes.alert} />
              )}
              <ClockIcon
                className={inActivity ? classes.activity : ""}
                width={21}
                height={24}
              />
            </div>
            <p className="neutral-dark text-large">{report.sum}</p>
          </div>
        </>
      )}
    </button>
  );
};

export default Report;
