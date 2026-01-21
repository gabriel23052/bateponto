import { useClockContext } from "../contexts/ClockContext";

import Report from "./Report";

const TodayReport = () => {
  const { todayReport } = useClockContext();

  return <Report report={todayReport} disableAlert={true} />;
};

export default TodayReport;
