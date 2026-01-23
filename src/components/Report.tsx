import ReportDate from "./ReportDate";
import CheckpointList from "./CheckpointList";
import ReportSum from "./ReportSum";
import DateUtility from "../utils/DateUtility";

import { useClockContext } from "../contexts/ClockContext";

import classes from "./Report.module.css";

type Props = {
  report: TReport;
  disableAlert?: boolean;
};

/**
 * Componente que exibe o histórico de períodos de um determinado dia
 */
const Report = ({ report, disableAlert }: Props) => {
  const { inActivity } = useClockContext();

  return (
    <button
      className={`bg-neutral-white ${classes.button} ${
        inActivity ? classes.activity : ""
      }`}
    >
      <ReportDate date={DateUtility.getReportViewDate(report.timestampId)} />
      {report.checkpoints.length === 0 ? (
        <p className={`neutral-lightgray text-default ${classes.noActivity}`}>
          Sem atividade
        </p>
      ) : (
        <>
          <CheckpointList checkpoints={report.checkpoints} />
          <ReportSum
            sum={DateUtility.getSumView(report.sum)}
            missingCheckpoint={report.checkpoints.length % 2 !== 0}
            disableAlert={disableAlert}
            inActivity={inActivity}
          />
        </>
      )}
    </button>
  );
};

export default Report;
