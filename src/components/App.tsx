import Greeting from "./Greeting";
import Clock from "./Clock";
import DateText from "./DateText";
import ClockInButton from "./ClockInButton";

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
      <ClockInButton />
    </main>
  );
};

export default App;
