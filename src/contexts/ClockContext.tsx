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
  addCheckpoint: () => void;
};

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

  const inActivity = useMemo(
    () => todayReport.missingCheckpoint,
    [todayReport],
  );

  const addCheckpoint = () => {
    clockHandler.addCheckpoint(new Date());
    setTodayReport(clockHandler.getReports(0, 1)[0]);
  };

  return (
    <ClockContext value={{ todayReport, addCheckpoint, inActivity }}>
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
