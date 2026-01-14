import Greeting from "./Greeting";
import Clock from "./Clock";
import DateText from "./DateText";
import ClockInSection from "./ClockInSection";

import classes from "./App.module.css";

/**
 * Container da aplicação
 */
const App = () => {
  return (
    <main className={classes.container}>
      <Greeting />
      <Clock />
      <DateText />
      <ClockInSection />
    </main>
  );
};

export default App;
