import Greeting from "./Greeting";
import Clock from "./Clock";
import DateText from "./DateText";
import ClockInSection from "./ClockInSection";
import { ActivityContextProvider } from "../contexts/ActivityContext";

import classes from "./App.module.css";

/**
 * Container da aplicação
 */
const App = () => {
  return (
    <main className={classes.container}>
      <ActivityContextProvider>
        <Greeting />
        <Clock />
        <DateText />
        <ClockInSection />
      </ActivityContextProvider>
    </main>
  );
};

export default App;
