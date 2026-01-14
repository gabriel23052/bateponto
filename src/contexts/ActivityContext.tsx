import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
} from "react";

type Props = {
  children: ReactNode;
};

type ContextState = {
  inActivity: boolean;
  setInActivity: Dispatch<React.SetStateAction<boolean>>;
};

const ActivityContext = createContext<ContextState | undefined>(undefined);

const ActivityContextProvider = ({ children }: Props) => {
  const [inActivity, setInActivity] = useState(false);

  return (
    <ActivityContext value={{ inActivity, setInActivity }}>
      {children}
    </ActivityContext>
  );
};

const useActivityContext = () => {
  const ctx = useContext(ActivityContext);
  if (ctx === undefined) throw new Error("ActivityContextProvider not found");
  return ctx;
};

// eslint-disable-next-line react-refresh/only-export-components
export { ActivityContextProvider, useActivityContext };
