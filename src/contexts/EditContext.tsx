import { createContext, useContext, useState, type ReactNode } from "react";

import { useClockContext } from "./ClockContext";

type ProviderProps = {
  children: ReactNode;
};

type ContextValue = {
  inEditionReport: TReport | null;
  editReport: (report: TReport) => void;
  eraseCheckpoint: (timestampId: number) => void;
  eraseAllCheckpoints: () => void;
  cleanEditReport: () => void;
  save: () => void;
};

/**
 * Contexto que mantém o estado da edição de relatórios
 */
const EditContext = createContext<ContextValue | undefined>(undefined);

const EditContextProvider = ({ children }: ProviderProps) => {
  const [inEditionReport, setInEditionReport] = useState<TReport | null>(null);

  const editReport = (report: TReport) => {
    setInEditionReport({
      ...report,
      checkpoints: [...report.checkpoints],
    });
  };

  const { replaceReport } = useClockContext();

  const eraseCheckpoint = (timestamp: number) => {
    setInEditionReport((prev) => {
      if (!prev) return null;
      const checkpoints = [...prev.checkpoints];
      checkpoints.splice(
        checkpoints.findIndex((rp) => rp === timestamp),
        1,
      );
      return { ...prev, checkpoints };
    });
    updateSum();
  };

  const eraseAllCheckpoints = () => {
    setInEditionReport((prev) => {
      if (!prev) return null;
      return { ...prev, checkpoints: [] };
    });
    updateSum();
  };

  const updateSum = () => {
    setInEditionReport((prev) => {
      if (!prev) return null;
      let sum = 0;
      for (let i = 0; i < prev.checkpoints.length; i += 2) {
        if (i + 1 < prev.checkpoints.length) {
          sum += prev.checkpoints[i + 1] - prev.checkpoints[i];
        }
      }
      return { ...prev, sum };
    });
  };

  const save = () => {
    if (!inEditionReport) return;
    replaceReport(inEditionReport);
    setInEditionReport(null);
  };

  const cleanEditReport = () => setInEditionReport(null);

  return (
    <EditContext
      value={{
        inEditionReport,
        editReport,
        eraseCheckpoint,
        eraseAllCheckpoints,
        cleanEditReport,
        save,
      }}
    >
      {children}
    </EditContext>
  );
};

const useEditContext = () => {
  const ctx = useContext(EditContext);
  if (ctx === undefined) throw new Error("EditContext not found");
  return ctx;
};

// eslint-disable-next-line react-refresh/only-export-components
export { EditContextProvider, useEditContext };
