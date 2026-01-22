import { useClockContext } from "../contexts/ClockContext";

import Report from "./Report";

/**
 * Componente wrapper para exibir o relatório do dia corrente
 */
const TodayReport = () => {
  const { reports } = useClockContext();
  return <Report report={reports.data[0]} disableAlert={true} />;
};

export default TodayReport;
