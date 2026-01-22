import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import ClockHandler from "../utils/ClockHandler";

type ProviderProps = {
  children: ReactNode;
};

type ContextValue = {
  inActivity: boolean;
  reports: { reachedEnd: boolean; data: TReportView[] };
  addCheckpoint: () => void;
  orderMoreReports: () => void;
};

const REPORTS_ORDER_AMOUNT = 5;

/**
 * Contexto que mantém o estado das batidas e históricos, se
 * mantém sincronizado com o localStorage via a classe ClockHandler
 */
const ClockContext = createContext<ContextValue | undefined>(undefined);

const clockHandler = new ClockHandler();

const ClockContextProvider = ({ children }: ProviderProps) => {
  const [reports, setReports] = useState(() => {
    const data = clockHandler.getReports(0, REPORTS_ORDER_AMOUNT);
    const reachedEnd = data.length < REPORTS_ORDER_AMOUNT;
    return { reachedEnd, data };
  });

  const [inActivity, setInActivity] = useState(reports.data[0].missingCheckpoint);

  const addCheckpoint = () => {
    const updatedReport = clockHandler.addCheckpoint(new Date());
    setInActivity(updatedReport.missingCheckpoint);
    setReports((prev) => {
      const index = prev.data.findIndex(
        (rp) => rp.timestampId === updatedReport.timestampId,
      );
      prev.data[index] = updatedReport;
      return prev;
    });
  };

  const orderMoreReports = () => {
    if (reports.reachedEnd) return;
    setReports((prev) => {
      const newData = clockHandler.getReports(
        prev.data.length + 1,
        REPORTS_ORDER_AMOUNT,
      );
      const reachedEnd = newData.length < REPORTS_ORDER_AMOUNT;
      return {
        reachedEnd,
        data: [...prev.data, ...newData],
      };
    });
  };

  return (
    <ClockContext
      value={{
        inActivity,
        reports,
        addCheckpoint,
        orderMoreReports,
      }}
    >
      {children}
    </ClockContext>
  );
};

const useClockContext = () => {
  const ctx = useContext(ClockContext);
  if (ctx === undefined) throw new Error("ClockContext not found");
  return ctx;
};

// eslint-disable-next-line react-refresh/only-export-components
export { ClockContextProvider, useClockContext };
