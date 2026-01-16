import Greeting from "./Greeting";
import Clock from "./Clock";
import DateText from "./DateText";
import ClockInSection from "./ClockInSection";
import { ActivityContextProvider } from "../contexts/ActivityContext";
import Report from "./Report";

import classes from "./App.module.css";

import "../debug/clockHandler";

// Temporário
const DAY_REPORT: TReportView = {
  date: {
    today: false,
    shortDate: "28/05",
    dayOfWeek: "qui",
  },
  timestamps: [
    ["12:52", "15:45"],
    ["16:52", "19:45"],
    ["20:52", "22:45"],
    ["20:53", "22:45"],
    ["20:54", "22:45"],
    ["20:55", "22:45"],
    ["20:56", "22:45"],
  ],
  sum: "10:55",
  missingTimestamp: true,
};

/**
 * Componente container da aplicação
 */
const App = () => {
  return (
    <main className={classes.container}>
      <ActivityContextProvider>
        <Greeting />
        <Clock />
        <DateText />
        <ClockInSection />
        <Report dayReport={DAY_REPORT} />
      </ActivityContextProvider>
    </main>
  );
};

export default App;
