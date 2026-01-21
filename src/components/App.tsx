import Greeting from "./Greeting";
import Clock from "./Clock";
import DateText from "./DateText";
import ClockInSection from "./ClockInSection";
import TodayReport from "./TodayReport";
import History from "./History";
import { ClockContextProvider } from "../contexts/ClockContext";

import classes from "./App.module.css";

/**
 * Componente container da aplicação
 */
const App = () => {
  return (
    <main className={classes.container}>
      <ClockContextProvider>
        <Greeting />
        <Clock />
        <DateText />
        <ClockInSection />
        <TodayReport />
        <History />
      </ClockContextProvider>
    </main>
  );
};

export default App;
