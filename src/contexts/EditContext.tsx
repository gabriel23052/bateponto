import { createContext, useContext, useState, type ReactNode } from "react";

import { useClockContext } from "./ClockContext";

type ProviderProps = {
  children: ReactNode;
};

type ContextValue = {
  inEditionReport: TReport | null;
  hasEdited: boolean;
  editReport: (report: TReport) => void;
  eraseCheckpoint: (id: number) => void;
  cleanEditReport: () => void;
  validateNewCheckpoint: (checkpointDate: Date) => string | null;
  addCheckpoint: (newCheckpointDate: Date) => void;
  save: () => void;
};

/**
 * Contexto que mantém o estado da edição de relatórios
 */
const EditContext = createContext<ContextValue | undefined>(undefined);

const EditContextProvider = ({ children }: ProviderProps) => {
  const [inEditionReport, setInEditionReport] = useState<TReport | null>(null);
  const [hasEdited, setHasEdited] = useState(false);

  const editReport = (report: TReport) => {
    setInEditionReport({
      ...report,
      checkpoints: [...report.checkpoints],
    });
    setHasEdited(false);
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
    setHasEdited(true);
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

  const validateNewCheckpoint = (checkpointDate: Date) => {
    if (!inEditionReport) return null;
    if (checkpointDate.getTime() > new Date().getTime())
      return "A batida não pode ser no futuro";
    if (inEditionReport.checkpoints.includes(checkpointDate.getTime()))
      return "Já existe uma batida nesse horário";
    return null;
  };

  const addCheckpoint = (newCheckpointDate: Date) => {
    setInEditionReport((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        checkpoints: [...prev.checkpoints, newCheckpointDate.getTime()].sort(
          (a, b) => a - b,
        ),
      };
    });
    setHasEdited(true);
    updateSum();
  };

  const save = () => {
    if (!inEditionReport) return;
    replaceReport({ ...inEditionReport });
    setInEditionReport(null);
  };

  const cleanEditReport = () => {
    setInEditionReport(null);
  };

  return (
    <EditContext
      value={{
        inEditionReport,
        hasEdited,
        editReport,
        eraseCheckpoint,
        cleanEditReport,
        validateNewCheckpoint,
        addCheckpoint,
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
