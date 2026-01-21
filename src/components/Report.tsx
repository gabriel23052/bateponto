import ReportDate from "./ReportDate";
import CheckpointList from "./CheckpointList";

import { useClockContext } from "../contexts/ClockContext";

import classes from "./Report.module.css";
import ReportSum from "./ReportSum";

type Props = {
  report: TReportView;
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
      <ReportDate date={report.date} />
      {report.checkpoints.length === 0 ? (
        <p className={`neutral-lightgray text-default ${classes.noActivity}`}>
          Sem atividade
        </p>
      ) : (
        <>
          <CheckpointList checkpoints={report.checkpoints} />
          <ReportSum
            sum={report.sum}
            missingCheckpoint={report.missingCheckpoint}
            disableAlert={disableAlert}
            inActivity={inActivity}
          />
        </>
      )}
    </button>
  );
};

export default Report;
