import { useClockContext } from "../contexts/ClockContext";

import Report from "./Report";

/**
 * Componente wrapper para exibir o relatório do dia corrente
 */
const TodayReport = () => {
  const { todayReport } = useClockContext();
  return <Report report={todayReport} disableAlert={true} />;
};

export default TodayReport;
