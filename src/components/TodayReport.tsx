import { useClockContext } from "../contexts/ClockContext";

import Report from "./report/Report";

/**
 * Wrapper para exibir o relatório do dia corrente
 */
const TodayReport = () => {
  const { reports } = useClockContext();
  return <Report report={reports.data[0]} disableAlert={true} />;
};

export default TodayReport;
