import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import ClockHandler from "../utils/ClockHandler";

type ProviderProps = {
  children: ReactNode;
};

type ContextValue = {
  todayReport: TReportView;
  inActivity: boolean;
  history: { reachedEnd: boolean; data: TReportView[] };
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
  const [todayReport, setTodayReport] = useState(
    clockHandler.getReports(0, 1)[0],
  );

  const [history, setHistory] = useState(() => {
    const data = clockHandler.getReports(1, REPORTS_ORDER_AMOUNT);
    const reachedEnd = data.length < REPORTS_ORDER_AMOUNT;
    return { reachedEnd, data };
  });

  const inActivity = useMemo(
    () => todayReport.missingCheckpoint,
    [todayReport],
  );

  const addCheckpoint = () => {
    clockHandler.addCheckpoint(new Date());
    setTodayReport(clockHandler.getReports(0, 1)[0]);
  };

  const orderMoreReports = () => {
    if (history.reachedEnd) return;
    setHistory((prev) => {
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
        todayReport,
        addCheckpoint,
        inActivity,
        history,
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
