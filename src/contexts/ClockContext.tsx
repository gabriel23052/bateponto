import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import ClockHandler from "../utils/ClockHandler";

type ProviderProps = {
  children: ReactNode;
};

type ContextValue = {
  inActivity: boolean;
  reports: { reachedEnd: boolean; data: TReport[] };
  addCheckpoint: () => void;
  orderMoreReports: () => void;
  replaceReport: (report: TReport) => void;
};

const REPORTS_ORDER_AMOUNT = 5;
const MID_NIGHT_REFRESH_DELAY = 100;

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

  const inActivity = useMemo(
    () => reports.data[0].checkpoints.length % 2 !== 0,
    [reports.data],
  );

  const _midNightTimeout = useRef<null | number>(null);

  const addCheckpoint = () => {
    const updatedReport = clockHandler.addCheckpoint(new Date());
    setReports((prev) => ({
      ...prev,
      data: prev.data.map((rp) =>
        rp.timestampId === updatedReport.timestampId ? updatedReport : rp,
      ),
    }));
  };

  const replaceReport = (report: TReport) => {
    clockHandler.replaceReport(report);
    setReports((prev) => {
      return {
        reachedEnd: prev.reachedEnd,
        data: prev.data.map((rp) => {
          if (rp.timestampId === report.timestampId) return { ...report };
          return rp;
        }),
      };
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

  const _getDifferenceToMidNight = () => {
    const now = new Date();
    const midNight = new Date();
    midNight.setHours(0, 0, 0, 0);
    midNight.setDate(midNight.getDate() + 1);
    return midNight.getTime() - now.getTime() + MID_NIGHT_REFRESH_DELAY;
  };

  const _midNightRefresh = () => {
    clockHandler.refresh();
    setReports((prev) => {
      const [todayReport, yesterDayReport] = clockHandler.getReports(0, 2);
      const newData = [...prev.data];
      newData[0] = todayReport;
      newData[1] = yesterDayReport;
      newData.pop();
      return { reachedEnd: prev.reachedEnd, data: newData };
    });
    _midNightTimeout.current = setTimeout(
      _midNightRefresh,
      _getDifferenceToMidNight(),
    );
  };

  useEffect(() => {
    _midNightTimeout.current = setTimeout(
      _midNightRefresh,
      _getDifferenceToMidNight(),
    );
    return () => {
      if (_midNightTimeout.current) {
        clearTimeout(_midNightTimeout.current);
        _midNightTimeout.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ClockContext
      value={{
        inActivity,
        reports,
        addCheckpoint,
        orderMoreReports,
        replaceReport,
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
