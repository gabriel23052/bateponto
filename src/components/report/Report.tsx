import ReportDate from "./ReportDate";
import CheckpointList from "../checkpoint/CheckpointList";
import ReportSum from "./ReportSum";
import DateUtility from "../../utils/DateUtility";

import { useClockContext } from "../../contexts/ClockContext";
import { useEditContext } from "../../contexts/EditContext";

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
  const { editReport } = useEditContext();

  const viewDate = DateUtility.getReportViewDate(report.id);

  return (
    <button
      className={`bg-neutral-white ${classes.button} ${
        inActivity ? classes.activity : ""
      }`}
      onClick={() => {
        editReport(report);
      }}
      aria-label={"Relatório do dia " + viewDate.shortDate + ", clique para editar"}
      aria-haspopup="dialog"
    >
      <ReportDate date={viewDate} />
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
          />
        </>
      )}
    </button>
  );
};

export default Report;
